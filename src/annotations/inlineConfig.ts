import { MetafoksAppConfig } from '../config';
import {
    LoggerFactoryLevel,
    LoggerFactoryType,
    MetafoksLoggerFactoryProperties,
    MetafoksContainer,
} from '../context';
import { createAnnotation } from '../utils';

export function InlineConfig<T>(config: T & MetafoksAppConfig) {
    return createAnnotation(target => {
        MetafoksContainer.main.configurator.configureOverrides(config);
    });
}

export function Logger(config: MetafoksLoggerFactoryProperties) {
    return createAnnotation(target => {
        MetafoksContainer.main.configurator.configureOverrides({
            logger: config,
        });
    });
}
export function LoggerLevel(logger: LoggerFactoryType, level: LoggerFactoryLevel) {
    return createAnnotation(target => {
        MetafoksContainer.main.configurator.configureOverrides({
            logger: {
                level: {
                    [logger]: level,
                },
            },
        });
    });
}

export const Overrides = InlineConfig;
export const Override = InlineConfig;
