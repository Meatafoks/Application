import { createLogger } from '../utils';
import { EventListenerMap, EventType } from './Types';

export class MetafoksEvents {
    private readonly logger = createLogger(MetafoksEvents);
    private readonly listeners: Partial<Record<EventType, Array<EventListenerMap[EventType]>>> = {};

    public constructor() {
        this.logger.info('started events listener');
    }

    public on<Event extends EventType>(event: Event, listener?: EventListenerMap[Event]) {
        if (!this.listeners[event]) this.listeners[event] = [];

        if (listener) {
            this.logger.debug(`subscribed event listener for event=${event}`);
            this.listeners[event]?.push(listener);
        } else {
            this.listeners[event] = undefined;
        }
    }

    public trackEvent<Event extends EventType>(event: Event, ...args: Parameters<EventListenerMap[Event]>) {
        this.listeners[event]?.forEach(value => {
            if (args && args.length > 0) {
                // @ts-ignore
                value(...args);
            } else {
                // @ts-ignore
                value();
            }
        });
    }
}
