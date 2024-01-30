import {
    aliasTo,
    asClass,
    asFunction,
    asValue,
    AwilixContainer,
    createContainer,
    InjectionMode,
} from 'awilix';
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
    public inlineConfig?: MetafoksAppConfig = undefined;

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

    public addValue<T>(name: string, target: T) {
        this.getContainer().register(name, asValue(target));
    }

    public addAlias<T>(name: string, source: string) {
        this.getContainer().register(name, aliasTo(source));
    }

    public addClass<T>(name: string, target: Constructor<T>) {
        this.getContainer().register(name, asClass(target).singleton());
    }

    public getConfig<T = {}>(): MetafoksAppConfig & T {
        return this.resolve('config');
    }

    public resolve<T = any>(name: string): T {
        return this.getContainer().resolve(name) as T;
    }
}
