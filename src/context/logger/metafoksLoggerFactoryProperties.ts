export type LoggerFactoryType = 'system' | 'app';
export type LoggerFactoryLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | string;

export interface MetafoksLoggerFactoryProperties {
    level?: Partial<Record<LoggerFactoryType, LoggerFactoryLevel>>;
    logsPath?: string;
    enabledFileWriting?: boolean;
}
