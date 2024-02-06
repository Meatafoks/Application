import { MetafoksLoader } from '../loader';
import { MetafoksEvents, EventType } from '../events';
import { MetafoksContext } from '../metafoksContext';
import { MetafoksConfigurator } from '../configurator';
import { Constructor, createLogger } from '../../utils';
import { MetafoksScanner } from '../scanner';
import { MetafoksLoggerFactory } from '../logger';
import { MetafoksApplicationProperties } from './metafoksApplicationProperties';

export class MetafoksRunApplication {
    private static instance?: MetafoksRunApplication = undefined;

    public static get main() {
        if (this.instance === undefined) this.instance = new MetafoksRunApplication();
        return this.instance;
    }

    private readonly logger = createLogger(MetafoksRunApplication);
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

    public startSync() {
        const configuration = this.configureComponents();

        this.loader
            .callExtensionsAutorun()
            .then(() => this.appMainClassStart())
            .catch(reason => {
                this.logger.error(`error while loading autorun: ${reason}`);
                throw reason;
            });

        return this;
    }

    public async start() {
        const configuration = this.configureComponents();

        await this.loader.callExtensionsAutorun();
        this.appMainClassStart();

        return this;
    }

    private configureComponents() {
        this.logger.debug('started application configuration');
        const configuration = this.configurator.configure();

        this.loggerFactory.configure(configuration.logger);
        this.loggerFactory.factory();

        this.scanner.configure(configuration.scanner);
        this.scanner.scan();

        this.loader.configure(configuration.loader);
        this.loader.loadExtensions();

        return configuration;
    }

    private appMainClassStart() {
        const app = this.context.resolve<{ start?: () => void; run?: () => void }>('app');
        this.events.trackEvent('applicationStart');

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
}
