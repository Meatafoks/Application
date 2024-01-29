export interface MetafoksConfigLoggerLevel {
    system?: string;
    app?: string;
}

export interface MetafoksConfigLogger {
    level?: MetafoksConfigLoggerLevel;
}

export interface MetafoksConfigScanner {
    service?: string;
    loader?: string;
    component?: string;
}

export interface MetafoksConfig {
    logger?: MetafoksConfigLogger;
    scanner?: MetafoksConfigScanner;
}

export interface MetafoksAppConfig {
    metafoks?: MetafoksConfig;
}
