import { MetafoksLogger } from '../Logger';
import { MetafoksConfigurator } from '../Configurator';
import { MetafoksEvents } from '../Events0';
import { MetafoksExtensions } from '../Extensions';
import { MetafoksComponentsScanner } from '../ComponentsScanner';
import { Counter, createLogger } from '../utils';
import { MainClass, MetafoksReflection } from './index';
import { MetafoksContext } from '../Context';
import { ApplicationConstructor } from '../Stereotypes';

export class MetafoksApplicationInstance {
    public static globalBindingCollector?: ApplicationConstructor;
    private readonly logger = createLogger(MetafoksApplicationInstance);

    public constructor(
        public readonly modules: {
            logger: MetafoksLogger;
            events: MetafoksEvents;
            context: MetafoksContext;
            configurator: MetafoksConfigurator;
            extensions: MetafoksExtensions;
            scanner: MetafoksComponentsScanner;
            self: ApplicationConstructor<MainClass>;
        },
    ) {}

    public async start() {
        const counter = new Counter().start();
        this.logger.debug('starting application');

        // Starting modules
        this.modules.scanner.start();

        // Extras
        this.modifyContext();
        await this.installExtensions();
        await this.loadExtensions();
        await this.runMainClass();

        this.logger.info(`started application (${counter.stop().getDeltaString()})`);
        return this.modules;
    }

    private modifyContext() {
        this.modules.context.addClass('app', this.modules.self);
        this.modules.context.addValue('config', this.modules.configurator.getConfig());

        MetafoksReflection.create(this.modules.context);
    }

    private async installExtensions() {
        const identifiers = Object.keys(this.modules.extensions.extensionsIdentifiersMap);
        this.logger.debug(`started extensions installer, found=${identifiers.length}`);
        let install = 0;

        for (const identifier of identifiers) {
            const extension = this.modules.extensions.extensionsIdentifiersMap[identifier];

            if (!extension.install) {
                this.logger.debug(`[${identifier}] installation function is undefined`);
            } else {
                this.logger.debug(`[${identifier}] started extension installing`);
                extension.install(this.modules.context);

                this.logger.info(`[${identifier}] extension installed`);
                install++;
            }

            this.modules.events.trackEvent('extensionLoaded', identifier);
        }

        this.logger.info(`completed extensions installer, installed=${install}`);
    }

    private async loadExtensions() {
        const identifiers = Object.keys(this.modules.extensions.extensionsIdentifiersMap);

        for (const identifier of identifiers) {
            const extension = this.modules.extensions.extensionsIdentifiersMap[identifier];
            if (!extension.autorun) continue;

            if (!this.modules.extensions.isAutorunEnabledFor(identifier)) {
                this.logger.info(`[${identifier}] autorun for extension disabled`);
                continue;
            }

            const counter = new Counter().start();
            this.logger.debug(`[${identifier}] started extension autorun`);

            await extension.autorun(this.modules.context);

            this.modules.events.trackEvent('extensionAutorunCompleted', identifier);
            this.logger.info(
                `[${identifier}] extension autorun completed (${counter.stop().getDeltaString()})`,
            );
        }
    }

    private async runMainClass() {
        this.modules.events.trackEvent('applicationStart');
        const app = this.modules.context.resolve<MainClass>('app');

        if (app.start) {
            this.logger.debug("starting main class 'start()' function");
            await app.start();
        }
        this.modules.events.trackEvent('applicationHasBeenStarted');
    }
}
