import { LoggerFactoryLevel, MetafoksLoggerFactoryProperties } from './metafoksLoggerFactoryProperties';
import { merge } from '../../utils/merge';
import { LoggerFactory } from '../../utils';
import { Bootloader } from '../boot';

export class MetafoksLoggerFactory extends Bootloader<MetafoksLoggerFactoryProperties> {
    public constructor() {
        super({
            level: {
                system: 'info',
                app: 'info',
            },
            enabledFileWriting: true,
            logsPath: 'logs',
        });
    }

    public async start() {
        const level = this.properties.level.app ?? 'info';

        if (this.properties?.enabledFileWriting === false) {
            this.configureNoFileWriting(level);
        } else {
            this.configureFileWriting(level);
        }
    }

    configureNoFileWriting(level: LoggerFactoryLevel) {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
            },
            categories: {
                default: { appenders: ['out'], level: level },
            },
        });
    }

    configureFileWriting(level: LoggerFactoryLevel) {
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
