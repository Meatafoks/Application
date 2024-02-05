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
import { MetafoksEnvKey } from './env';
import { ContextEventName } from '../events';

export class MetafoksContext {
    private static instance?: MetafoksContext = undefined;

    public static getContext() {
        if (this.instance === undefined) this.instance = new MetafoksContext();
        return this.instance;
    }

    public static env<T = string>(name: MetafoksEnvKey, defaultValue: T): T;
    public static env<T = string>(name: MetafoksEnvKey): T | undefined;
    public static env<T = string>(
        name: MetafoksEnvKey,
        defaultValue: T | undefined = undefined,
    ): T | undefined {
        return (process.env[name] as T | undefined) ?? defaultValue;
    }

    private readonly container: AwilixContainer;
    public readonly listeners: Partial<Record<ContextEventName, Array<(identifier: string) => void>>> = {};
    public inlineConfig?: MetafoksAppConfig = undefined;

    public constructor() {
        this.container = createContainer({
            injectionMode: InjectionMode.PROXY,
            strict: true,
        });
    }

    public on(event: ContextEventName, listener?: (identifier: string) => void) {
        if (listener) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event]?.push(listener);
        }
    }

    public trackEvent<TArg = string>(event: ContextEventName, args: TArg) {
        this.listeners[event]?.forEach(value => value(args as string));
    }

    public has(name: string) {
        return this.getContainer().hasRegistration(name);
    }

    public getContainer() {
        return this.container;
    }

    public addFunction<T>(name: string, target: FunctionReturning<T>) {
        this.getContainer().register(name, asFunction(target).singleton());
        this.trackEvent('componentRegistered', name);
    }

    public addValue<T>(name: string, target: T) {
        this.getContainer().register(name, asValue(target));
        this.trackEvent('componentRegistered', name);
    }

    public addAlias<T>(name: string, source: string) {
        this.getContainer().register(name, aliasTo(source));
        this.trackEvent('componentRegistered', name);
    }

    public addClass<T>(name: string, target: Constructor<T>) {
        this.getContainer().register(name, asClass(target).singleton());
        this.trackEvent('componentRegistered', name);
    }

    public getConfig<T = {}>(): MetafoksAppConfig & T {
        return this.resolve('config');
    }

    public resolve<T = any>(name: string): T {
        return this.getContainer().resolve(name) as T;
    }
}
