import { MetafoksContext } from '../../Context';

export interface Reflection {
    has(name: string): boolean;
    resolve<T>(name: string): T;
}

export class MetafoksReflection {
    public static create(context: MetafoksContext) {
        const has = (name: string) => context.has(name);
        const resolve = <T>(name: string) => context.resolve<T>(name);

        context.addValue<Reflection>('reflection', {
            has,
            resolve,
        });
    }
}
