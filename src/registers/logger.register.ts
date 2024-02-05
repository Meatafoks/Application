import { MetafoksAppConfig } from '../config';
import { LoggerFactory } from '../utils';
import { MetafoksContext } from '../context';

export interface LoggerFactoryProps {
    level?: {
        app?: string;
        system?: string;
    };
    disableFileWriting?: boolean;
}

export function registerLoggerFactory(context: MetafoksContext, props: LoggerFactoryProps = {}) {
    const config = context.resolve('config') as MetafoksAppConfig;
    const level = props.level?.app ?? config.metafoks?.logger?.level?.app ?? 'INFO';

    LoggerFactory.app.level = level;

    if (!props.disableFileWriting) {
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
