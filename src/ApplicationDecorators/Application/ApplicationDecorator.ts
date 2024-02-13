import { Context, ContextProperties } from '../Context';
import { Logger, LoggerProperties } from '../Logger';
import { ComponentsScan, ComponentsScanProperties } from '../ComponentsScan';
import { Extensions, ExtensionsProperties } from '../Extensions';
import { MetafoksApplicationProperties } from '../../Application';
import { ApplicationDecorator } from '../ApplicationDecorator';
import { Configurator, ConfiguratorProperties } from '../Configurator';
import { Events } from '../Events';
import { ApplicationConstructor } from '../../Stereotypes';

export function MetafoksApplication<TClass>(target: ApplicationConstructor<TClass>) {
    Configurator(target);
    Events(target);
    Logger(target);
    Context(target);
    ComponentsScan(target);
    Extensions(target);
}

export function MetafoksApplicationWithProperties(
    properties: MetafoksApplicationProperties,
): ApplicationDecorator {
    return target => {
        ContextProperties(properties.context ?? {})(target);
        ConfiguratorProperties(properties.configurator ?? {})(target);
        LoggerProperties(properties.logger ?? {})(target);
        ComponentsScanProperties(properties.scanner ?? {})(target);
        ExtensionsProperties(properties.extensions ?? {})(target);
    };
}
