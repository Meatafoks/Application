import { ApplicationDecorator } from '../ApplicationDecorator';
import { MetafoksConfigurator, MetafoksConfiguratorProperties } from '../../Configurator';

export const Configurator: ApplicationDecorator = target => {
    if (!target.configurator) target.configurator = new MetafoksConfigurator();
};

export function ConfiguratorProperties(
    properties: Partial<MetafoksConfiguratorProperties>,
): ApplicationDecorator {
    return target => {
        Configurator(target);
        target.configurator!.overrideProperties(properties);
    };
}
