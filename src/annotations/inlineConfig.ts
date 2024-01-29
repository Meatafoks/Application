import { MetafoksAppConfig } from '../config';
import { MetafoksContext } from '../context';

export function InlineConfig<T extends MetafoksAppConfig>(config: T) {
    return (target: any) => {
        MetafoksContext.getContext().inlineConfig = config;
    };
}
