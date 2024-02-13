import { ApplicationDecorator } from '../ApplicationDecorator';
import { EventListenerMap, EventType } from '../../Events0';
import { Events } from './EventsDecorator';

export function EventListener<Event extends EventType>(
    event: Event,
    listener?: EventListenerMap[Event],
): ApplicationDecorator {
    return target => {
        Events(target);
        target.events!.on(event, listener);
    };
}

export const Subscribe = EventListener;
