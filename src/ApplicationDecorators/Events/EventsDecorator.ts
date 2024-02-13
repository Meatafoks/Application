import { ApplicationDecorator } from '../ApplicationDecorator';
import { MetafoksEvents } from '../../Events0';

export const Events: ApplicationDecorator = target => {
    if (!target.events) target.events = new MetafoksEvents();
};
