import { ComponentConstructor } from '../Stereotypes';
import { BindingProperty, BindingPropertyType } from '../Binding';
import { MetafoksApplicationInstance } from '../Application';
import { Context } from '../ApplicationDecorators';

export function Bind(name?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        (descriptor.value as BindingPropertyType).bindingName = name ?? propertyKey;
        (descriptor.value as BindingPropertyType).parentContextName = () =>
            (target.constructor as ComponentConstructor).componentName;

        if (MetafoksApplicationInstance.globalBindingCollector) {
            Context(MetafoksApplicationInstance.globalBindingCollector);
            const property = new BindingProperty(descriptor.value);
            property.addToContext(MetafoksApplicationInstance.globalBindingCollector.context!);
        }
    };
}

export type BindingValue<T> = () => T;
