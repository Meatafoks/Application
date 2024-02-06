import { MetafoksLoggerFactoryProperties } from './metafoksLoggerFactoryProperties';
import { merge } from '../../utils/merge';
import { LoggerFactory } from '../../utils';

export class MetafoksLoggerFactory {
    private properties: MetafoksLoggerFactoryProperties = {
        level: {
            system: 'INFO',
            app: 'INFO',
            scanner: 'INFO',
        },
        disableFileWriting: false,
    };

    public constructor() {}

    public configure(properties: Partial<MetafoksLoggerFactoryProperties> = {}) {
        // this.logger.debug(`applying configuration=${JSON.stringify(properties)}`);
        this.properties = merge(this.properties, properties);
    }

    public factory() {
        const level = this.properties.level?.app ?? 'INFO';
        LoggerFactory.app.level = level;

        if (this.properties?.disableFileWriting === false) {
            configureNoFileWriting(level);
        } else {
            configureFileWriting(level);
        }
    }
}

function configureNoFileWriting(level: string) {
    LoggerFactory.configure({
        appenders: {
            out: { type: 'stdout' },
        },
        categories: {
            default: { appenders: ['out'], level: level },
        },
    });
}

function configureFileWriting(level: string) {
    LoggerFactory.configure({
        appenders: {
            out: { type: 'stdout' },
            file: { type: 'file', filename: 'logs/debug.log' },
        },
        categories: {
            default: { appenders: ['file', 'out'], level: level },
        },
    });
}
