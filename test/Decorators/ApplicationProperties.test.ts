import {
    ApplicationConstructor,
    MetafoksApplicationWithProperties,
    MetafoksComponentsScannerProperties,
    MetafoksContextProperties,
    MetafoksExtensionsProperties,
} from '../../src';
import { MetafoksLoggerProperties } from '../../src/Logger';
import { MetafoksConfiguratorProperties } from '../../src/Configurator';

describe('application properties trigger', () => {
    const loggerProperties: MetafoksLoggerProperties = {
        logsPath: '1',
        enabled: false,
        enabledFileWriting: false,
        level: { app: 'error', system: 'error' },
    };

    const scannerProperties: MetafoksComponentsScannerProperties = {
        enabled: false,
        componentsGlob: ['1'],
        loadersGlob: ['2'],
        exclude: ['3'],
    };

    const extensionsProperties: MetafoksExtensionsProperties = {
        autorun: { disabled: ['1'] },
        enabled: false,
    };

    const configuratorProperties: MetafoksConfiguratorProperties = {
        profile: 'test',
        configPath: 'path',
    };

    const contextProperties: MetafoksContextProperties = {
        disableRegistrations: ['4'],
    };

    @MetafoksApplicationWithProperties({
        configurator: configuratorProperties,
        logger: loggerProperties,
        scanner: scannerProperties,
        extensions: extensionsProperties,
        context: contextProperties,
    })
    class App {}

    it('should setup modules', () => {
        const target = App as ApplicationConstructor<App>;

        expect(target.logger?.properties).toEqual(loggerProperties);
        expect(target.configurator?.properties).toEqual(configuratorProperties);
        expect(target.scanner?.properties).toEqual(scannerProperties);
        expect(target.extensions?.properties).toEqual(extensionsProperties);
        expect(target.context?.properties).toEqual(contextProperties);
    });
});
