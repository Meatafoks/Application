import { MetafoksAppConfig } from '../config';
import { LoggerFactory } from '../utils';
import { MetafoksContext } from '../context';

export function registerLoggerFactory(
    context: MetafoksContext,
    options: { disableFileWriting?: boolean } = {},
) {
    const config = context.resolve('config') as MetafoksAppConfig;
    const level = config.metafoks?.logger?.level?.app ?? 'INFO';

    LoggerFactory.app.level = level;
    if (!options.disableFileWriting) {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
                file: { type: 'file', filename: 'logs/debug.log' },
            },
            categories: {
                default: { appenders: ['file', 'out'], level: level },
            },
        });
    } else {
        LoggerFactory.configure({
            appenders: {
                out: { type: 'stdout' },
            },
            categories: {
                default: { appenders: ['out'], level: level },
            },
        });
    }
}
