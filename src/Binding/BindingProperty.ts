import { MetafoksContext } from '../Context';
import { BindingPropertyType } from './BindingPropertyType';
import { createLogger } from '../utils';

export class BindingProperty {
    private readonly logger = createLogger(BindingProperty);

    public static isBindingProperty(target: Partial<BindingPropertyType>): target is BindingPropertyType {
        return !!target.bindingName && !!target.parentContextName;
    }

    constructor(public readonly property: BindingPropertyType) {}

    public get bindingName(): string {
        return this.property.bindingName;
    }

    public get parentContextName(): string | undefined {
        return this.property.parentContextName();
    }

    public getOriginalProperty() {
        return this.property;
    }

    public getParentContextComponent(context: MetafoksContext) {
        if (!this.parentContextName) return {};
        if (!context.has(this.parentContextName)) {
            this.logger.warn(
                `component '${this.parentContextName}' requested by '${this.bindingName}' binding not found in context`,
            );
            return {};
        }
        return context.resolve(this.parentContextName);
    }

    public getWrappedFunction(context: MetafoksContext) {
        return (...args: any[]) => {
            return this.getOriginalProperty().apply(this.getParentContextComponent(context), args);
        };
    }

    public addToContext(context: MetafoksContext) {
        context.addValue(this.bindingName, this.getWrappedFunction(context));
    }
}
