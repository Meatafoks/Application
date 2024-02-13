import { LoggerLevel, MetafoksLoggerProperties } from './MetafoksLoggerProperties';
import { createLogger, LoggerFactory } from '../utils';
import { merge } from '../utils/merge';

export class MetafoksLogger {
    private readonly logger = createLogger(MetafoksLogger);

    public properties: MetafoksLoggerProperties = {
        logsPath: 'logs',
        enabled: true,
        enabledFileWriting: true,
        level: {
            system: 'info',
            app: 'info',
        },
    };

    public constructor() {
        this.logger.info('started logger');
    }

    public overrideProperties(properties?: Partial<MetafoksLoggerProperties>) {
        if (properties) {
            this.properties = merge.withOptions(
                { mergeArrays: false },
                this.properties,
                properties ?? {},
            ) as MetafoksLoggerProperties;
            this.logger.info(`properties changed=${JSON.stringify(properties)}`);

            this.start();
        }
    }

    public overrideLevelProperties(properties?: Partial<MetafoksLoggerProperties['level']>) {
        this.properties.level = merge(
            this.properties.level,
            properties ?? {},
        ) as MetafoksLoggerProperties['level'];
        this.logger.info(`level properties changed=${JSON.stringify(properties)}`);

        this.start();
    }

    public start() {
        const level = this.properties.level.app;

        if (this.properties?.enabledFileWriting === false) {
            this.configureNoFileWriting(level);
        } else {
            this.configureFileWriting(level);
        }
    }

    configureNoFileWriting(level: LoggerLevel) {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
            },
            categories: {
                default: { appenders: ['out'], level: level },
            },
        });
    }

    configureFileWriting(level: LoggerLevel) {
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
