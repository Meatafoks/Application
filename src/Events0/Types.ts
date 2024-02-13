export type ExtensionLoadedEvent = (identifier: string) => void;
export type ExtensionAutorunCompletedEvent = (identifier: string) => void;
export type ComponentRegisteredEvent = (name: string) => void;
export type ApplicationStartEvent = () => void;
export type ApplicationHasBeenStartedEvent = () => void;

export type EventListenerMap = {
    extensionLoaded: ExtensionLoadedEvent;
    extensionAutorunCompleted: ExtensionAutorunCompletedEvent;
    componentRegistered: ComponentRegisteredEvent;
    applicationStart: ApplicationStartEvent;
    applicationHasBeenStarted: ApplicationHasBeenStartedEvent;
};

export type EventType = keyof EventListenerMap;
