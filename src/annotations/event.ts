import { EventListenerMap, EventType, MetafoksRunApplication } from '../context';
import { createAnnotation } from '../utils';

export function EventListener<Event extends EventType>(event: Event, listener?: EventListenerMap[Event]) {
    return createAnnotation(target => {
        MetafoksRunApplication.main.events.on(event, listener);
    });
}
