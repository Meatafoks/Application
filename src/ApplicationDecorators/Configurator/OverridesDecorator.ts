import { MetafoksAppConfig } from '../../config';

import { ApplicationDecorator } from '../ApplicationDecorator';
import { Configurator } from './ConfiguratorDecorator';

export function Overrides<TConfig>(config: Partial<TConfig> & MetafoksAppConfig): ApplicationDecorator {
    return target => {
        if (!target.configurator) Configurator(target);
        target.configurator!.overrideConfig(config);
    };
}

export const Override = Overrides;
