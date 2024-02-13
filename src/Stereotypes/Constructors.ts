import { MetafoksContext } from '../Context';
import { MetafoksEvents } from '../Events0';
import { MetafoksConfigurator } from '../Configurator';
import { MetafoksExtensions } from '../Extensions';
import { MetafoksLogger } from '../Logger';
import { MetafoksComponentsScanner } from '../ComponentsScanner';
import awi from 'awilix';

export interface ComponentConstructor<T = any> {
    /**
     * Main constructor function
     * @param args
     */
    new (...args: any[]): T;

    componentName?: string;
    [awi.RESOLVER]?: any;
}

export type FunctionComponent<T> = awi.FunctionReturning<T>;

export interface ApplicationConstructor<T = any> extends ComponentConstructor<T> {
    /**
     * Main constructor function
     * @param args
     */
    new (...args: any[]): T;

    self?: ApplicationConstructor<T>;
    context?: MetafoksContext;
    events?: MetafoksEvents;
    configurator?: MetafoksConfigurator;
    extensions?: MetafoksExtensions;
    logger?: MetafoksLogger;
    scanner?: MetafoksComponentsScanner;
}

export type AnyComponent<T> = FunctionComponent<T> | ComponentConstructor<T> | T;
