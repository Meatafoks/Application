export type LoggerFactoryType = 'system' | 'app' | 'scanner';
export type LoggerFactoryLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | string;

export interface MetafoksLoggerFactoryProperties {
    level?: Partial<Record<LoggerFactoryType, LoggerFactoryLevel>>;
    disableFileWriting?: boolean;
}
