import { asClass, asFunction, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { FunctionReturning } from 'awilix/lib/container';
import { Constructor } from 'awilix/lib/resolvers';
import { MetafoksAppConfig } from '../config';

export class MetafoksContext {
    private static instance?: MetafoksContext = undefined;

    public static getContext() {
        if (this.instance === undefined) this.instance = new MetafoksContext();
        return this.instance;
    }

    private readonly container: AwilixContainer;

    public constructor() {
        this.container = createContainer({
            injectionMode: InjectionMode.PROXY,
            strict: true,
        });
    }

    public getContainer() {
        return this.container;
    }

    public addFunction<T>(name: string, target: FunctionReturning<T>) {
        this.getContainer().register(name, asFunction(target).singleton());
    }

    public addClass<T>(name: string, target: Constructor<T>) {
        this.getContainer().register(name, asClass(target).singleton());
    }

    public getConfig(): MetafoksAppConfig {
        return this.resolve('config');
    }

    public resolve(name: string) {
        return this.getContainer().resolve(name);
    }
}
