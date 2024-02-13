import { ApplicationDecorator } from '../ApplicationDecorator';
import { ConfiguratorProperties } from './ConfiguratorDecorator';

export function Profile(profile?: string): ApplicationDecorator {
    return ConfiguratorProperties({ profile });
}

export const ActiveProfile = Profile;
