import { MetafoksContext } from '../metafoksContext';
import { MetafoksScannerProperties } from './metafoksScannerProperties';
import { MetafoksEnv } from '../env';
import { MetafoksEvents } from '../events';
import { Bootloader } from '../boot';

export class MetafoksScanner extends Bootloader<MetafoksScannerProperties> {
    public constructor(
        private context: MetafoksContext,
        private events: MetafoksEvents,
    ) {
        super({
            enabled: true,
            service: MetafoksEnv.env('SCANNER_SERVICE_PATTERN', [
                './src/**/*.service.ts',
                './src/**/*Service.ts',
            ]),
            component: MetafoksEnv.env('SCANNER_COMPONENT_PATTERN', [
                './src/**/*.component.ts',
                './src/**/*.dao.ts',
                './src/**/*Component.ts',
                './src/**/*DAO.ts',
            ]),
            loader: MetafoksEnv.env('SCANNER_LOADER_PATTERN', [
                './src/**/*.loader.ts',
                './src/**/*Loader.ts',
            ]),
        });
    }

    public async start() {
        if (!this.properties.enabled) {
            this.logger.debug('components scanned disabled');
            return;
        }

        this.logger.debug('started components scanner');
        this.logger.trace(this.properties);

        const components = this.scanComponents();
        const services = this.scanServices();
        const loaders = this.scanLoaders();

        const registrations = {
            ...components.registrations,
            ...services.registrations,
            ...loaders.registrations,
        };

        for (const name of Object.keys(registrations)) {
            this.events.trackEvent('componentRegistered', name);
        }

        this.logger.info(
            `components scanning completed, loaded components=${Object.keys(registrations).length}`,
        );
    }

    private scanComponents() {
        const raw = this.properties.component ?? [];
        const paths = raw instanceof Array ? raw : [raw];
        return this.context.addComponentsByPath(paths);
    }

    private scanServices() {
        const raw = this.properties.service ?? [];
        const paths = raw instanceof Array ? raw : [raw];
        return this.context.addComponentsByPath(paths);
    }

    private scanLoaders() {
        const raw = this.properties.loader ?? [];
        const paths = raw instanceof Array ? raw : [raw];
        return this.context.addLoadersByPath(paths);
    }
}
