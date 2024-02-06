import { MetafoksExtension, MetafoksExtensionManifest } from '../../exension';
import { createLogger, LoggerFactory } from '../../utils';
import { MetafoksContext } from '../metafoksContext';
import { MetafoksEvents } from '../events/metafoksEvents';
import { MetafoksLoaderProperties } from './metafoksLoaderProperties';
import { merge } from '../../utils/merge';

export class MetafoksLoader {
    private readonly logger = createLogger(MetafoksLoader);
    private readonly extensions: MetafoksExtension[] = [];
    private readonly manifests: Record<string, Omit<MetafoksExtensionManifest, 'loaders' | 'components'>> =
        {};

    private properties: MetafoksLoaderProperties = {
        enabled: true,
        autorun: {
            disabled: false,
        },
    };

    public constructor(
        private readonly context: MetafoksContext,
        private readonly events: MetafoksEvents,
    ) {}

    public configure(properties: Partial<MetafoksLoaderProperties> = {}) {
        this.logger.debug(`applying configuration=${JSON.stringify(properties)}`);
        this.properties = merge(this.properties, properties);
    }

    public addExtensions(extensions: MetafoksExtension[]) {
        this.extensions.push(...extensions);
    }

    /**
     * Loads application extensions
     */
    public loadExtensions() {
        if (this.properties.enabled === false) {
            this.logger.info('loader disabled with `config:loader.enabled=false`');
            return;
        }

        this.logger.debug('started loading extension...');
        for (const extension of this.extensions) {
            const manifest = extension(this.context);
            const loaders = manifest.loaders ?? {};
            const components = manifest.components ?? {};

            for (const loader of Object.keys(loaders)) {
                this.context.addFunction(loader, loaders[loader]);
            }
            for (const component of Object.keys(components)) {
                this.context.addClass(component, components[component]);
            }

            this.manifests[manifest.identifier] = {
                identifier: manifest.identifier,
                autorun: manifest.autorun,
            };
            this.logger.info(`loaded extension with identifier=${manifest.identifier}`);
            this.events.trackEvent('extensionLoaded', manifest.identifier);
        }

        this.logger.info(`loaded ${Object.keys(this.extensions).length} extensions`);
        this.logger.trace(JSON.stringify(this.extensions, null, 2));
    }

    /**
     * Runs extensions autorun function
     */
    public async callExtensionsAutorun() {
        const disable = this.properties.autorun?.disabled || [];

        if (typeof disable === 'boolean' && disable) {
            this.logger.info('extensions autorun disabled by config `config:loader.autorun.disable=true`');
            return;
        }

        this.logger.debug('started extensions autorun functions');

        for await (const manifests of Object.values(this.manifests)) {
            if (disable.includes(manifests.identifier)) {
                this.logger.debug(
                    `[${manifests.identifier}] autorun disabled by config \`config:loader.autorun.disable=[...]\``,
                );
                continue;
            }
            if (manifests.autorun) {
                this.logger.debug(`[${manifests.identifier}] autorun started`);

                await manifests.autorun();
                this.logger.info(`[${manifests.identifier}] autorun completed`);
            }
        }

        this.logger.info('completed extensions autorun functions');
    }
}
