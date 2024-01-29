import { MetafoksAppConfig } from '../config';
import { LoggerFactory } from '../utils/loggerFactory';
import { MetafoksContext } from '../context';

export function registerLoggerFactory(context: MetafoksContext) {
    const config = context.resolve('config') as MetafoksAppConfig;
    const level = config.metafoks?.logger?.level?.app ?? 'INFO';

    LoggerFactory.app.level = level;
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
