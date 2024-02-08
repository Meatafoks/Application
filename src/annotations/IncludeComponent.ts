import { ComponentInfo } from '../components';
import { createAnnotation } from '../utils';
import { MetafoksContainer } from '../context';

export function IncludeComponent(name: string, info: ComponentInfo<any>) {
    return createAnnotation(() => {
        MetafoksContainer.main.configurator.addExternalComponents({ [name]: info });
    });
}
