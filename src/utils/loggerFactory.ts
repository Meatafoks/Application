import { configure, getLogger } from 'log4js';

/**
 * Фабрика логирования
 */
export class LoggerFactory {
    /**
     * Стандартный логгер
     */
    public static app = getLogger('MetafoksApplication');

    /**
     * Настройка логов
     */
    public static configure = configure;

    public static createLogger(it: any) {
        return this.createLoggerByName(it.name);
    }

    public static createLoggerByName(name: string) {
        return getLogger(name);
    }
}

export function createLogger(it: any) {
    return LoggerFactory.createLogger(it);
}
