import { ApplicationDecorator } from './ApplicationDecorator';
import { ApplicationConstructor } from '../Stereotypes';

export function Extend<T>(from: ApplicationConstructor<T>): ApplicationDecorator {
    return target => {
        target.logger = from.logger;
        target.configurator = from.configurator;
        target.events = from.events;
        target.context = from.context;
        target.scanner = from.scanner;
        target.extensions = from.extensions;
    };
}
