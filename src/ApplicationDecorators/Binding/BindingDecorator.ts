import { Autowire } from '../Context';
import { BindingProperty } from '../../Binding';
import { ApplicationDecorator } from '../ApplicationDecorator';
import { ComponentConstructor } from '../../Stereotypes';

export function Binding(bindingsTarget: ComponentConstructor): ApplicationDecorator {
    return app => {
        if (!bindingsTarget.componentName)
            throw new Error(bindingsTarget.toString() + ' does not have @Component registration');

        Autowire(bindingsTarget.componentName, bindingsTarget)(app);

        const prototype = bindingsTarget.prototype;
        const keys = Object.getOwnPropertyNames(prototype);

        for (const key of keys) {
            if (BindingProperty.isBindingProperty(prototype[key])) {
                const bindingProperty = new BindingProperty(prototype[key]);
                bindingProperty.addToContext(app.context!);
            }
        }
    };
}
