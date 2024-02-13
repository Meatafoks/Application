import { ApplicationDecorator } from '../ApplicationDecorator';
import { Context } from './ContextDecorator';
import { AnyComponent } from '../../Stereotypes';

export function Autowire<T>(name: string, component: AnyComponent<T>): ApplicationDecorator;
export function Autowire<T>(component: AnyComponent<T>): ApplicationDecorator;

export function Autowire<T>(
    name: string | AnyComponent<T>,
    component?: AnyComponent<T>,
): ApplicationDecorator {
    return target => {
        Context(target);

        if (typeof name !== 'string') {
            if (
                name &&
                typeof name === 'object' &&
                'componentName' in name &&
                typeof name.componentName === 'string'
            ) {
                target.context!.addComponent(name.componentName, name);
            }
            return;
        }

        target.context!.addComponent(name, component);
    };
}
