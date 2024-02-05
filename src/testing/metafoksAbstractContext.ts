import { MetafoksContext } from '../context';

export class MetafoksAbstractContext {
    public constructor(private context: MetafoksContext) {}

    public getContext() {
        return this.context;
    }

    /**
     * Experimental feature.
     *
     * @param name
     * @param field
     * @param mock
     */
    public mockComponentField<TComponent, TMock = any>(name: string, field: keyof TComponent, mock: TMock) {
        const component = this.resolve<TComponent>(name);
        this.getContext().addValue(name, {
            ...component,
            [field]: mock,
        });
    }

    public mock<TMock = any>(name: string, mock: TMock) {
        this.getContext().addValue(name, mock);
    }

    public resolve<T = any>(name: string) {
        return this.getContext().resolve<T>(name);
    }
}
