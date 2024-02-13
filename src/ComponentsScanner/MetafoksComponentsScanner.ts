import { MetafoksComponentsScannerProperties } from './MetafoksComponentsScannerProperties';
import { createLogger } from '../utils';
import { merge } from '../utils/merge';
import { MetafoksContext } from '../Context';

export class MetafoksComponentsScanner {
    private readonly logger = createLogger(MetafoksComponentsScanner);
    public properties: MetafoksComponentsScannerProperties = {
        enabled: true,
        componentsGlob: [
            // Services
            './src/**/*.service.ts',
            './src/**/*Service.ts',

            // Components
            './src/**/*.component.ts',
            './src/**/*Component.ts',

            // DAO's
            './src/**/*.dao.ts',
            './src/**/*DAO.ts',
        ],
        loadersGlob: ['./src/**/*.loader.ts', './src/**/*Loader.ts'],
        exclude: [],
    };

    public constructor(private readonly context: MetafoksContext) {}

    public overrideProperties(properties?: Partial<MetafoksComponentsScannerProperties>) {
        if (properties) {
            this.properties = merge.withOptions(
                { mergeArrays: false },
                this.properties,
                properties,
            ) as MetafoksComponentsScannerProperties;
            this.logger.info(`properties changed=${JSON.stringify(properties)}`);
        }
    }

    public start() {
        this.logger.info('started scanner');

        if (!this.properties.enabled) {
            this.logger.debug('components scanned disabled');
            return;
        }

        this.logger.debug('started components scanner');
        this.logger.trace(this.properties);

        const components = this.scanComponents();
        const loaders = this.scanLoaders();

        const registrations = {
            ...components.registrations,
            ...loaders.registrations,
        };

        for (const name of Object.keys(registrations)) {
            this.context.trackComponentRegistration(name);
        }

        this.logger.info(
            `components scanning completed, loaded components=${Object.keys(registrations).length}`,
        );
    }

    private scanComponents() {
        const raw = this.properties.componentsGlob ?? [];
        const paths = raw instanceof Array ? raw : [raw];
        return this.context.addComponentsByPath(paths);
    }

    private scanLoaders() {
        const raw = this.properties.loadersGlob ?? [];
        const paths = raw instanceof Array ? raw : [raw];
        return this.context.addLoadersByPath(paths);
    }
}
