import { MetafoksContainer } from '../context';
import { createAnnotation } from '../utils';

export function Profile(profile?: string) {
    return createAnnotation((target: any) => {
        MetafoksContainer.main.configurator.setProfile(profile);
    });
}

export const ActiveProfile = Profile;
