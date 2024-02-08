import { Constructor, FunctionReturning } from '../utils';
import awx from 'awilix';

export enum ComponentType {
    service = 'service',
    component = 'component',
    loader = 'loader',
    value = 'value',
}

export type ComponentInfo<T> =
    | {
          type: ComponentType.component;
          component: Constructor<T>;
      }
    | { type: ComponentType.service; component: Constructor<T> }
    | { type: ComponentType.loader; component: FunctionReturning<T> }
    | { type: ComponentType.value; component: T };

export function asComponent<T>(component: Constructor<T>): ComponentInfo<T> {
    return { type: ComponentType.component, component };
}

export function asService<T>(component: Constructor<T>): ComponentInfo<T> {
    return { type: ComponentType.service, component };
}
export function asLoader<T>(component: FunctionReturning<T>): ComponentInfo<T> {
    return { type: ComponentType.loader, component };
}
export function asValue<T>(component: T): ComponentInfo<T> {
    return { type: ComponentType.value, component };
}
