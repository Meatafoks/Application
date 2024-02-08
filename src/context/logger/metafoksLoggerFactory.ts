import { MetafoksLoggerFactoryProperties } from './metafoksLoggerFactoryProperties';
import { merge } from '../../utils/merge';
import { LoggerFactory } from '../../utils';

export class MetafoksLoggerFactory {
    private properties: MetafoksLoggerFactoryProperties = {
        level: {
            system: 'INFO',
            app: 'INFO',
        },
        enabledFileWriting: true,
        logsPath: 'logs',
    };

    public constructor() {}

    public configure(properties: Partial<MetafoksLoggerFactoryProperties> = {}) {
        this.properties = merge(this.properties, properties);
    }

    public factory() {
        const level = this.properties.level?.app ?? 'INFO';
        LoggerFactory.app.level = level;

        if (this.properties?.enabledFileWriting === false) {
            this.configureNoFileWriting(level);
        } else {
            this.configureFileWriting(level);
        }
    }

    configureNoFileWriting(level: string) {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
            },
            categories: {
                default: { appenders: ['out'], level: level },
            },
        });
    }

    configureFileWriting(level: string) {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
                file: { type: 'file', filename: `${this.properties.logsPath}/debug.log` },
            },
            categories: {
                default: { appenders: ['file', 'out'], level: level },
            },
        });
    }
}
