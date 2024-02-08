import { createMethodAnnotation } from '../utils';
import { MetafoksContainer } from '../context';
import { contextName } from '../utils';

export function Bind(name?: string) {
    return createMethodAnnotation((target: any, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        const fn = function (...args: any[]) {
            if (target.constructor[contextName]) {
                const thisArg = MetafoksContainer.main.context.resolve(target.constructor[contextName]);
                return originalMethod.apply(thisArg, args);
            } else {
                return originalMethod.apply({}, args);
            }
        };
        MetafoksContainer.main.context.addFunction(name ?? propertyKey, () => fn);
    });
}
