import { configure, getLogger, Logger as CoreLogger } from 'log4js';

export type Logger = CoreLogger;

/**
 * Фабрика логирования
 */
export class LoggerFactory {
    /**
     * Настройка логов
     */
    public static configure = configure;

    public static createLogger(it: any): Logger {
        return this.createLoggerByName(it.name);
    }

    public static createLoggerByName(name: string): Logger {
        return getLogger(name);
    }
}

export function createLogger(it: any): Logger {
    return LoggerFactory.createLogger(it);
}
