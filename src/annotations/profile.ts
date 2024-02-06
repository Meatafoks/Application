import { MetafoksRunApplication } from '../context';
import { createAnnotation } from '../utils';

export function Profile(profile?: string) {
    return createAnnotation((target: any) => {
        MetafoksRunApplication.main.configurator.setProfile(profile);
    });
}

export const ActiveProfile = Profile;
