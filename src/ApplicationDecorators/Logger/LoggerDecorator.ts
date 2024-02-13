import { ApplicationDecorator } from '../ApplicationDecorator';
import { LoggerLevel, LoggerType, MetafoksLogger, MetafoksLoggerProperties } from '../../Logger';
import { Configurator } from '../Configurator';

export const Logger: ApplicationDecorator = target => {
    Configurator(target);

    if (!target.logger) {
        target.logger = new MetafoksLogger();
        target.logger.overrideProperties(target.configurator!.getConfig().logger);
        target.logger.start();
    }
};

export function LoggerProperties(properties: Partial<MetafoksLoggerProperties>): ApplicationDecorator {
    return target => {
        Logger(target);
        target.logger!.overrideProperties(properties);
    };
}

export const LoggerNoFiles: ApplicationDecorator = target => {
    return LoggerProperties({ enabledFileWriting: false })(target);
};

export function LoggerLevelProperties(
    properties: Partial<MetafoksLoggerProperties['level']>,
): ApplicationDecorator {
    return target => {
        Logger(target);
        target.logger!.overrideLevelProperties(properties);
    };
}

export function LoggerLevel(logger: LoggerType, level: LoggerLevel) {
    return LoggerLevelProperties({ [logger]: level });
}
