import { RESOLVER } from 'awilix';
import { ComponentDecorator } from './ComponentsDecorator';

export function Component(name?: string): ComponentDecorator {
    return target => {
        target[RESOLVER] = { name };
        target.componentName = name;
    };
}

export const Service = Component;
export const Repository = Component;
export const DAO = Component;
