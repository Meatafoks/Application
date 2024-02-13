import { ApplicationDecorator } from '../ApplicationDecorator';
import {
    MetafoksExtensions,
    MetafoksExtensionsProperties,
    MetafoksExtensionsPropertiesAutorun,
} from '../../Extensions';
import { Events } from '../Events';
import { Configurator } from '../Configurator';

export const Extensions: ApplicationDecorator = target => {
    Configurator(target);
    Events(target);
    if (!target.extensions) {
        target.extensions = new MetafoksExtensions(target.events!);
        target.extensions!.overrideProperties(target.configurator!.getConfig().extensions);
    }
};

export function ExtensionsProperties(
    properties: Partial<MetafoksExtensionsProperties>,
): ApplicationDecorator {
    return target => {
        Extensions(target);
        target.extensions!.overrideProperties(properties);
    };
}

export function ExtensionsAutorunProperties(
    properties: Partial<MetafoksExtensionsPropertiesAutorun>,
): ApplicationDecorator {
    return target => {
        Extensions(target);
        target.extensions!.overrideAutorunProperties(properties);
    };
}
