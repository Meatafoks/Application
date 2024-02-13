import { ApplicationDecorator } from '../ApplicationDecorator';
import { ConfiguratorProperties } from './ConfiguratorDecorator';

export function ConfigPath(configPath: string): ApplicationDecorator {
    return ConfiguratorProperties({ configPath });
}

export const ConfigFrom = ConfigPath;
