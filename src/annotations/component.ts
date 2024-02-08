import { RESOLVER } from 'awilix';
import { createAnnotation } from '../utils';
import { contextName } from '../utils/contextName';

export function Component(name?: string) {
    return createAnnotation(target => {
        (target as any)[RESOLVER] = { name };
        (target as any)[contextName] = name;
    });
}

export const Service = Component;
