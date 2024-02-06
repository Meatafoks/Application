import { MetafoksAppConfig } from '../../config';
import { EventListenerMap } from '../events';
import { MetafoksExtension } from '../../exension';

export interface MetafoksApplicationProperties<TConfig = {}> {
    profile?: string;
    configPath?: string;

    config?: TConfig & MetafoksAppConfig;
    events?: Partial<EventListenerMap>;
    mocks?: Record<string, any>;
    extensions?: MetafoksExtension[];
}
