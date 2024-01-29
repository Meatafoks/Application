import { MetafoksAppConfig } from '../config';
import { MetafoksContext } from '../context';

export function InlineConfig<T>(config: T & MetafoksAppConfig) {
    return (target: any) => {
        MetafoksContext.getContext().inlineConfig = config;
    };
}
