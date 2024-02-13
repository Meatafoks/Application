import { ApplicationDecorator } from '../ApplicationDecorator';
import { Events } from '../Events';
import { MetafoksContext, MetafoksContextProperties } from '../../Context';
import { ApplicationConstructor } from '../../Stereotypes';

export const Context: ApplicationDecorator = target => {
    Events(target);
    if (!target.context) target.context = new MetafoksContext(target.events!);
};

export function ContextProperties(properties: Partial<MetafoksContextProperties>): ApplicationDecorator {
    return target => {
        Context(target);
        target.context!.overrideProperties(properties);
    };
}
