import { MetafoksContext } from '../context';
import { ConfigLoaderProps, registerConfigLoader } from './config.loader';
import { LoggerFactoryProps, registerLoggerFactory } from '../registers/logger.register';
import { ComponentsLoaderProps, registerComponentsLoader } from './components.loader';
import { registerExtensionsLoader } from './extensions.loader';
import { MetafoksApplicationExtension } from '../exension';
import { ApplicationEvents } from '../events';

export interface ApplicationLoaderProps<TConfig = any> {
    with?: MetafoksApplicationExtension[];
    config?: ConfigLoaderProps<TConfig>;
    logger?: LoggerFactoryProps;
    componentsLoader?: ComponentsLoaderProps;
    events?: ApplicationEvents;
}

export function applicationLoader(context: MetafoksContext, props: ApplicationLoaderProps = {}) {
    context.on('extensionLoaded', props.events?.onExtensionLoaded);
    context.on('componentRegistered', props.events?.onComponentRegistered);

    registerConfigLoader(context, props.config);
    registerLoggerFactory(context, props.logger);
    registerComponentsLoader(context, props.componentsLoader);
    registerExtensionsLoader(context, { extensions: props.with });
}
