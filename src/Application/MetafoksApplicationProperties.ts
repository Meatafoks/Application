import { MetafoksLoggerProperties } from '../Logger';
import { MetafoksComponentsScannerProperties } from '../ComponentsScanner';
import { MetafoksExtensionsProperties } from '../Extensions';
import { MetafoksConfiguratorProperties } from '../Configurator';
import { MetafoksContextProperties } from '../Context';

export interface MetafoksApplicationProperties {
    configurator?: Partial<MetafoksConfiguratorProperties>;
    logger?: Partial<MetafoksLoggerProperties>;
    context?: Partial<MetafoksContextProperties>;
    scanner?: Partial<MetafoksComponentsScannerProperties>;
    extensions?: Partial<MetafoksExtensionsProperties>;
}
