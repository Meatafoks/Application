import { RESOLVER } from 'awilix';
import { createAnnotation } from '../utils';

export function Component(name?: string) {
    return createAnnotation(target => {
        (target as any)[RESOLVER] = { name };
    });
}

export const Service = Component;
