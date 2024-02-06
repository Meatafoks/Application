import { MetafoksRunApplication } from '../context';
import { createAnnotation } from '../utils';

export function ConfigPath(path: string) {
    return createAnnotation(target => {
        MetafoksRunApplication.main.configurator.setConfigPath(path);
    });
}

export const ConfigFrom = ConfigPath;
