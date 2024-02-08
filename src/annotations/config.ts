import { MetafoksContainer } from '../context';
import { createAnnotation } from '../utils';

export function ConfigPath(path: string) {
    return createAnnotation(target => {
        MetafoksContainer.main.configurator.setConfigPath(path);
    });
}

export const ConfigFrom = ConfigPath;
