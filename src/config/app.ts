import { MetafoksLoaderProperties } from '../context';
import { MetafoksScannerProperties } from '../context';
import { MetafoksLoggerFactoryProperties } from '../context';

export interface MetafoksAppConfig {
    logger?: MetafoksLoggerFactoryProperties;
    scanner?: MetafoksScannerProperties;
    loader?: MetafoksLoaderProperties;
}
