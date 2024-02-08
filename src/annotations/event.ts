import { EventListenerMap, EventType, MetafoksContainer } from '../context';
import { createAnnotation } from '../utils';

export function EventListener<Event extends EventType>(event: Event, listener?: EventListenerMap[Event]) {
    return createAnnotation(target => {
        MetafoksContainer.main.events.on(event, listener);
    });
}
