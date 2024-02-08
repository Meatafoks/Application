import { MetafoksAppConfig } from '../../config';
import { EventListenerMap } from '../events';
import { MetafoksExtension } from '../../exension';
import { ComponentInfo } from '../../components';

export interface MetafoksContainerProperties<TConfig = {}> {
    profile?: string;
    configPath?: string;

    config?: TConfig & MetafoksAppConfig;
    events?: Partial<EventListenerMap>;
    mocks?: Record<string, any>;
    extensions?: MetafoksExtension[];

    components?: Record<string, ComponentInfo<any>>;
}
