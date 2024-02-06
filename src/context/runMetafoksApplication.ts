import { MetafoksApplicationProperties, MetafoksRunApplication } from './app';
import { Constructor } from '../utils';

export function runMetafoksApplication<TClass, TConfig>(
    mainClass: Constructor<TClass>,
    properties: MetafoksApplicationProperties<TConfig> = {},
) {
    MetafoksRunApplication.main.configure(properties);
    MetafoksRunApplication.main.setAppMainClass(mainClass);
    MetafoksRunApplication.main.startSync();
}
