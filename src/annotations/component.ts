import { RESOLVER } from 'awilix';

export function Component(name?: string) {
    return (target: any) => {
        target[RESOLVER] = { name };
    };
}
