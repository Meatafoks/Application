import { EventListenerMap, EventType } from './events';
import { createLogger } from '../../utils';

export class MetafoksEvents {
    private readonly logger = createLogger(MetafoksEvents);
    private readonly listeners: Partial<Record<EventType, Array<EventListenerMap[EventType]>>> = {};

    public setEventsLoggerLevel(level?: string) {
        this.logger.level = level ?? 'info';
    }

    public on<Event extends EventType>(event: Event, listener?: EventListenerMap[Event]) {
        if (listener) {
            this.logger.debug(`subscribed event listener for event=${event}`);
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event]?.push(listener);
        }
    }

    public trackEvent<Event extends EventType>(event: Event, ...args: Parameters<EventListenerMap[Event]>) {
        this.listeners[event]?.forEach(value => value.apply(this, args as any));
    }
}
