import {
    MetafoksExtension,
    MetafoksExtensionLoaderManifest,
    MetafoksExtensionManifest,
} from '../../exension';
import { MetafoksContext } from '../metafoksContext';
import { MetafoksEvents } from '../events';
import { MetafoksLoaderProperties } from './metafoksLoaderProperties';
import { Bootloader } from '../boot';

export class MetafoksExtensionsLoader extends Bootloader<MetafoksLoaderProperties> {
    /**
     * Extensions that would be loaded
     * @private
     */
    private readonly extensions: MetafoksExtension[] = [];

    /**
     * Already loaded extensions manifests
     * @private
     */
    private readonly loadedManifestsMap: Record<string, MetafoksExtensionManifest> = {};

    public constructor(
        private readonly context: MetafoksContext,
        private readonly events: MetafoksEvents,
    ) {
        super({
            enabled: true,
            autorun: {
                disabled: false,
            },
        });
    }

    /**
     * Adds extensions to boot load plan
     * @param extensions
     */
    public add(extensions: MetafoksExtension[]) {
        this.extensions.push(...extensions);
    }

    public getManifest(name: string) {
        return this.loadedManifestsMap[name];
    }

    public async start(withAutoRun: boolean = true): Promise<void> {
        if (!this.properties.enabled) {
            this.logger.info('extensions loader disabled with `config:loader.enabled=false`');
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

            this.loadedManifestsMap[manifest.identifier] = {
                identifier: manifest.identifier,
                autorun: manifest.autorun,
            };

            this.logger.info(`loaded extension with identifier=${manifest.identifier}`);
            this.events.trackEvent('extensionLoaded', manifest.identifier);
        }

        this.logger.info(`loaded ${Object.keys(this.extensions).length} extensions`);
        this.logger.trace(JSON.stringify(this.extensions, null, 2));

        if (withAutoRun) {
            await this.runLoadedExtensionsAutorunFunctions();
        }
    }

    public isExtensionsAutorunEnabled() {
        return this.properties.autorun.disabled !== true;
    }

    public isExtensionAutorunEnabled(identifier: string) {
        if (this.properties.autorun.disabled instanceof Array) {
            return !this.properties.autorun.disabled.includes(identifier);
        }
        return this.isExtensionsAutorunEnabled();
    }

    /**
     * Runs extensions autorun function
     */
    public async runLoadedExtensionsAutorunFunctions() {
        if (!this.isExtensionsAutorunEnabled()) {
            this.logger.info('extensions autorun disabled by config `config:loader.autorun.disable=true`');
            return;
        }

        this.logger.debug('started extensions autorun functions');

        for await (const manifest of Object.values(this.loadedManifestsMap)) {
            const { identifier, autorun } = manifest;

            // Continue if extension not includes autorun function
            if (!autorun) continue;

            // Check if it is not disabled
            if (!this.isExtensionAutorunEnabled(identifier)) {
                this.logger.debug(
                    `[${identifier}] autorun disabled by  \`config:loader.autorun.disabled=[...]\``,
                );
                continue;
            }

            this.logger.debug(`[${manifest.identifier}] autorun started`);

            await autorun();
            this.logger.info(`[${manifest.identifier}] autorun completed`);
        }

        this.logger.info('completed extensions autorun functions');
    }
}
