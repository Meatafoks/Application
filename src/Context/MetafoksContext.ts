import {
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
import { MetafoksEvents } from '../Events0';
import { createLogger, isConstructor, isFunctionReturning } from '../utils';
import { MetafoksContextProperties } from './MetafoksContextProperties';
import { AnyComponent, ComponentConstructor, FunctionComponent } from '../Stereotypes';
import { merge } from '../utils/merge';

/**
 * Metafoks application context
 */
export class MetafoksContext {
    private readonly logger = createLogger(MetafoksContext);

    private readonly container: AwilixContainer;

    public properties: MetafoksContextProperties = {
        disableRegistrations: [],
    };

    public constructor(private events: MetafoksEvents) {
        this.container = createContainer({
            injectionMode: InjectionMode.PROXY,
            strict: true,
        });
        this.logger.info('started context');
    }

    public overrideProperties(properties?: Partial<MetafoksContextProperties>) {
        if (properties) {
            this.properties = merge.withOptions({ mergeArrays: false }, this.properties, properties);
            this.logger.info(`properties changed=${JSON.stringify(properties)}`);
        }
    }

    public has(name: string) {
        return this.container.hasRegistration(name);
    }

    public trackComponentRegistration(name: string) {
        this.events.trackEvent('componentRegistered', name);
    }

    public addComponent<T>(name: string, target: AnyComponent<T>) {
        if (isConstructor(target)) {
            return this.addClass(name, target);
        }

        if (isFunctionReturning(target)) {
            return this.addFunction(name, target);
        }

        return this.addValue(name, target);
    }

    public addFunction<T>(name: string, target: FunctionComponent<T>) {
        if (this.properties.disableRegistrations?.includes(name)) {
            this.logger.debug(`denied registration for component=${name}`);
            return false;
        }

        this.container.register(name, asFunction(target).singleton());
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as loader`);
        return true;
    }

    public addValue<T>(name: string, target: T) {
        if (this.properties.disableRegistrations?.includes(name)) {
            this.logger.debug(`denied registration for component=${name}`);
            return false;
        }

        this.container.register(name, asValue(target));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as value`);
        return true;
    }

    public addMock<T>(name: string, target: T) {
        if (!this.properties.disableRegistrations) {
            this.properties.disableRegistrations = [];
        }
        this.properties.disableRegistrations.push(name);

        this.container.register(name, asValue(target));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered mock and disabled registration for component=${name}`);
        return true;
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

    public addAlias(name: string, source: string) {
        if (this.properties.disableRegistrations?.includes(name)) {
            this.logger.debug(`denied registration for component=${name}`);
            return false;
        }

        this.container.register(name, aliasTo(source));
        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered alias=${name}`);
        return true;
    }

    public addClass<T>(name: string, target: ComponentConstructor<T>) {
        if (this.properties.disableRegistrations?.includes(name)) {
            this.logger.debug(`denied registration for component=${name}`);
            return false;
        }

        target.componentName = name;
        this.container.register(name, asClass(target).singleton());

        this.events.trackEvent('componentRegistered', name);
        this.logger.debug(`registered component=${name} as class`);
        return true;
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
