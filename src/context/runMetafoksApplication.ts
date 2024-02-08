import { MetafoksApplicationProperties, MetafoksContainer } from './app';
import { ApplicationConstructor, Constructor, contextName } from '../utils';

export function runMetafoksApplication<TClass, TConfig>(
    mainClass: ApplicationConstructor<TClass>,
    properties: MetafoksApplicationProperties<TConfig> = {},
) {
    mainClass[contextName] = 'app';
    mainClass.container = MetafoksContainer.main;
    mainClass.context = MetafoksContainer.main.context;

    MetafoksContainer.main.configure(properties);
    MetafoksContainer.main.setAppMainClass(mainClass);
    MetafoksContainer.main.start().catch(reason => {
        throw reason;
    });
}
