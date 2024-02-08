import { Logger, LoggerFactory } from '../../utils/loggerFactory';
import { merge } from '../../utils/merge';

export abstract class Bootloader<PropertiesType extends {}> {
    protected readonly logger: Logger;
    protected properties: Required<PropertiesType>;

    protected constructor(properties: Required<PropertiesType>) {
        this.properties = properties;
        this.logger = LoggerFactory.createLoggerByName(this.constructor.name);
    }

    public configure(properties?: Partial<PropertiesType>) {
        if (!properties) return;

        this.properties = merge(this.properties, properties) as Required<PropertiesType>;
        this.logger.info(`applying configuration=${JSON.stringify(properties)}`);
    }

    /**
     * Starts bootloader
     */
    public abstract start(): Promise<void>;
}
