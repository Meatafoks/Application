import { MetafoksLoader } from '../loader';
import { MetafoksEvents, EventType } from '../events';
import { MetafoksContext } from '../metafoksContext';
import { MetafoksConfigurator } from '../configurator';
import { Constructor, createLogger } from '../../utils';
import { MetafoksScanner } from '../scanner';
import { MetafoksLoggerFactory } from '../logger';
import { MetafoksApplicationProperties } from './metafoksApplicationProperties';
import { Reflection } from '../reflect';

export class MetafoksContainer {
    private static instance?: MetafoksContainer = undefined;

    public static get main() {
        if (this.instance === undefined) this.instance = new MetafoksContainer();
        return this.instance;
    }

    private readonly logger = createLogger(MetafoksContainer);
    private started = false;

    public readonly configurator: MetafoksConfigurator;
    public readonly context: MetafoksContext;
    public readonly events: MetafoksEvents;
    public readonly loader: MetafoksLoader;
    public readonly scanner: MetafoksScanner;
    public readonly loggerFactory: MetafoksLoggerFactory;

    public constructor(properties: MetafoksApplicationProperties = {}) {
        this.events = new MetafoksEvents();
        this.context = new MetafoksContext(this.events);

        this.configurator = new MetafoksConfigurator(this.context);
        this.scanner = new MetafoksScanner(this.context, this.events);
        this.loader = new MetafoksLoader(this.context, this.events);

        this.loggerFactory = new MetafoksLoggerFactory();
        this.configure(properties);
    }

    public configure<TConfig = {}>(properties: Partial<MetafoksApplicationProperties<TConfig>> = {}) {
        this.logger.debug(`applying configuration=${JSON.stringify(properties)}`);

        if (properties.config) this.configurator.configureOverrides(properties.config);
        if (properties.profile) this.configurator.setProfile(properties.profile);
        if (properties.configPath) this.configurator.setConfigPath(properties.configPath);

        if (properties.config?.logger?.level?.system) {
            this.context.setContextLoggerLevel(properties.config?.logger.level.system);
            this.events.setEventsLoggerLevel(properties.config?.logger.level.system);
        }

        if (properties.events) {
            for (const event in properties.events) {
                this.events.on(event as EventType, properties.events[event as EventType]);
            }
        }

        if (properties.extensions) {
            this.loader.addExtensions(properties.extensions);
        }

        if (properties.mocks) {
            for (const mock in properties.mocks) {
                this.context.addMock(mock, properties.mocks[mock]);
            }
        }

        return this;
    }

    public setAppMainClass(clazz: Constructor<any>) {
        this.context.addClass('app', clazz);
        return this;
    }

    public async start() {
        this.logger.debug('started application configuration');
        this.addReflection();

        const configuration = this.configurator.configure();

        this.loggerFactory.configure(configuration.logger);
        this.loggerFactory.factory();

        this.scanner.configure(configuration.scanner);
        this.scanner.scan();

        this.loader.configure(configuration.loader);
        this.loader.loadExtensions();

        try {
            await this.loader.callExtensionsAutorun();
        } catch (e) {
            this.logger.error(`error with extension autorun: ${e}`);
            throw e;
        }
        this.appMainClassStart();

        return this;
    }

    public isStarted() {
        return this.started;
    }

    private appMainClassStart() {
        const app = this.context.resolve<{ start?: () => void; run?: () => void }>('app');
        this.events.trackEvent('applicationStart');
        this.started = true;

        if (app.start) {
            this.events.trackEvent('applicationHasBeenStarted');
            app.start();
            return;
        }

        if (app.run) {
            this.events.trackEvent('applicationHasBeenStarted');
            app.run();
            return;
        }
    }

    private addReflection() {
        const has = (name: string) => this.context.has(name);
        const resolve = <T>(name: string) => this.context.resolve<T>(name);

        this.context.addValue('reflection', { has, resolve } as Reflection);
    }
}
