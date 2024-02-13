export type LoggerType = 'system' | 'app' | string;
export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | string;

export interface MetafoksLoggerProperties {
    enabled: boolean;
    enabledFileWriting: boolean;

    logsPath: string;
    level: Record<LoggerType, LoggerLevel>;
}
