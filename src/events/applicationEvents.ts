export interface ApplicationEvents {
    onStarted?: () => void;
    onExtensionLoaded?: ApplicationExtensionLoadedEvent;
    onComponentRegistered?: ApplicationComponentLoadedEvent;
}

export type ApplicationExtensionLoadedEvent = (identifier: string) => void;
export type ApplicationComponentLoadedEvent = (name: string) => void;
