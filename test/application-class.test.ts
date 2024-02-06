import {
    createExtension,
    DisableAutorun,
    EventListener,
    Extension,
    Logger,
    LoggerLevel,
    MetafoksApplication,
    MetafoksRunApplication,
    Overrides,
} from '../src';

describe('test class components', () => {
    const startFn = jest.fn();
    const extensionLoaded = jest.fn();

    const testExtAutorunFn = jest.fn();
    const testAnotherExtAutorunFn = jest.fn();

    const testExt = createExtension(context => {
        return {
            identifier: 'testExt',
            autorun: testExtAutorunFn,
        };
    });

    const testAnotherExt = createExtension(context => {
        return {
            identifier: 'testAnotherExt',
            autorun: testAnotherExtAutorunFn,
        };
    });

    @MetafoksApplication
    @Overrides({ some: 'value' })
    @Logger({ disableFileWriting: true })
    @Extension(testExt, testAnotherExt)
    @LoggerLevel('system', 'debug')
    @LoggerLevel('app', 'debug')
    @DisableAutorun('testAnotherExt')
    @EventListener('extensionLoaded', extensionLoaded)
    class Application {
        public start() {
            startFn();
        }
    }

    it('should load components', async () => {
        // preload
        await new Promise(resolve => setTimeout(resolve, 400));

        const config = MetafoksRunApplication.main.context.getConfig<any>();

        expect(startFn).toHaveBeenCalled();
        expect(config.some).toEqual('value');

        // Extensions loaded
        expect(extensionLoaded).toHaveBeenCalledWith('testExt');
        expect(extensionLoaded).toHaveBeenCalledWith('testAnotherExt');

        // Extension autorun
        expect(testExtAutorunFn).toHaveBeenCalled();
        expect(testAnotherExtAutorunFn).not.toHaveBeenCalled();
    });
});
