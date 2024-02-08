import { MetafoksExtensionsLoader } from '../loader';
import { MetafoksEvents, EventType } from '../events';
import { MetafoksContext } from '../metafoksContext';
import { MetafoksConfigurator } from '../configurator';
import { Constructor, createLogger } from '../../utils';
import { MetafoksScanner } from '../scanner';
import { MetafoksLoggerFactory } from '../logger';
import { MetafoksContainerProperties } from './metafoksContainerProperties';
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
    public readonly loader: MetafoksExtensionsLoader;
    public readonly scanner: MetafoksScanner;
    public readonly loggerFactory: MetafoksLoggerFactory;

    public constructor(properties: MetafoksContainerProperties = {}) {
        this.events = new MetafoksEvents();
        this.context = new MetafoksContext(this.events);
        this.loader = new MetafoksExtensionsLoader(this.context, this.events);

        this.configurator = new MetafoksConfigurator(this.context, this.events, this.loader);
        this.scanner = new MetafoksScanner(this.context, this.events);

        this.loggerFactory = new MetafoksLoggerFactory();
        this.configure(properties);
    }

    public configure<TConfig = {}>(properties: Partial<MetafoksContainerProperties<TConfig>> = {}) {
        this.logger.debug(`applying configuration=${JSON.stringify(properties)}`);

        if (properties.config) this.configurator.configureOverrides(properties.config);
        if (properties.profile) this.configurator.configureProfile(properties.profile);
        if (properties.configPath) this.configurator.setConfigPath(properties.configPath);

        if (properties.config?.logger?.level?.system) {
            this.context.setContextLoggerLevel(properties.config?.logger.level.system);
            this.events.setEventsLoggerLevel(properties.config?.logger.level.system);
        }

        this.configurator.addEventsSubscription(properties.events);
        this.configurator.addMocks(properties.mocks);
        this.configurator.addExternalComponents(properties.components);
        this.configurator.addExtensions(properties.extensions);

        return this;
    }

    public setAppMainClass(clazz: Constructor<any>) {
        this.context.addClass('app', clazz);
        return this;
    }

    public async start() {
        this.logger.debug('started application configuration');
        const configuration = this.configurator.configure();

        this.loggerFactory.configure(configuration.logger);
        await this.loggerFactory.start();

        this.scanner.configure(configuration.scanner);
        await this.scanner.start();

        this.loader.configure(configuration.loader);
        await this.loader.start();

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
}
