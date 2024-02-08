import awx, {
    aliasTo,
    asClass,
    asFunction,
    asValue,
    AwilixContainer,
    createContainer,
    InjectionMode,
    GlobWithOptions,
} from 'awilix';
import { MetafoksAppConfig } from '../config';
import { MetafoksEvents } from './events';
import { MetafoksContextProperties } from './conext/metafoksContextProperties';
import { Constructor, createLogger, FunctionReturning } from '../utils';
import { contextName } from '../utils/contextName';
import { LoggerFactoryLevel } from './logger';
import { ComponentInfo, ComponentType } from '../components';

/**
 * Metafoks application context
 */
export class MetafoksContext {
    private readonly logger = createLogger(MetafoksContext);

    private readonly container: AwilixContainer;

    private properties: MetafoksContextProperties = {
        disableRegistrations: [],
    };

    public constructor(private events: MetafoksEvents) {
        this.container = createContainer({
            injectionMode: InjectionMode.PROXY,
            strict: true,
        });
        this.logger.level = 'debug';
    }

    public setContextLoggerLevel(level?: LoggerFactoryLevel) {
        this.logger.level = level ?? 'info';
    }

    public has(name: string) {
        return this.container.hasRegistration(name);
    }

    public addFunction<T>(name: string, target: FunctionReturning<T>) {
        if (this.properties.disableRegistrations?.includes(name))
            return this.logger.debug(`denied registration for component=${name}`);

        this.container.register(name, asFunction(target).singleton());
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as loader`);
    }

    public addValue<T>(name: string, target: T) {
        if (this.properties.disableRegistrations?.includes(name))
            return this.logger.debug(`denied registration for component=${name}`);

        this.container.register(name, asValue(target));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as value`);
    }

    public addMock<T>(name: string, target: T) {
        if (!this.properties.disableRegistrations) {
            this.properties.disableRegistrations = [];
        }
        this.properties.disableRegistrations.push(name);

        this.container.register(name, asValue(target));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered mock and disabled registration for component=${name}`);
    }

    /**
     * Removes mock from disabled registrations
     * @param name
     */
    public removeMock(name: string) {
        if (this.properties.disableRegistrations) {
            this.properties.disableRegistrations = this.properties.disableRegistrations.filter(
                v => v !== name,
            );
            this.logger.debug(`removed mock and enabled registration for component=${name}`);
        }
    }

    /**
     * Adds component to context
     *
     * @param name
     * @param component
     */
    public addComponent<T>(name: string, component: ComponentInfo<T>) {
        switch (component.type) {
            case ComponentType.component:
                return this.addClass(name, component.component);
            case ComponentType.loader:
                return this.addFunction(name, component.component);
            case ComponentType.service:
                return this.addClass(name, component.component);
            case ComponentType.value:
                return this.addValue(name, component.component);
        }
    }

    public addAlias<T>(name: string, source: string) {
        if (this.properties.disableRegistrations?.includes(name))
            return this.logger.debug(`denied registration for component=${name}`);

        this.container.register(name, aliasTo(source));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered alias=${name}`);
    }

    public addClass<T>(name: string, target: Constructor<T>) {
        if (this.properties.disableRegistrations?.includes(name))
            return this.logger.debug(`denied registration for component=${name}`);

        this.container.register(name, asClass(target).singleton());
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as object`);
    }

    public getConfig<T = {}>(): MetafoksAppConfig & T {
        return this.resolve('config');
    }

    public resolve<T = any>(name: string): T {
        return this.container.resolve(name) as T;
    }

    public addComponentsByPath(paths: string[]) {
        return this.container.loadModules(
            paths.map<GlobWithOptions>(it => [it, { lifetime: 'SINGLETON', register: asClass }]),
            {
                formatName: 'camelCase',
            },
        );
    }

    public addLoadersByPath(paths: string[]) {
        return this.container.loadModules(
            paths.map<GlobWithOptions>(it => [it, { lifetime: 'SINGLETON', register: asFunction }]),
            {
                formatName: name => name.replace('.loader', ''),
            },
        );
    }
}
