import {
    DisableAutorun,
    EventListener,
    Extend,
    Extension,
    ExtensionFactory,
    Overrides,
    runMetafoksApplication,
} from '../src';
import { AbstractApplication } from './AbstractApplication';

describe('testing extension loader with disable autorun', () => {
    const startFn = jest.fn();
    const extensionLoaded = jest.fn();

    const testExtAutorunFn = jest.fn();
    const testAnotherExtAutorunFn = jest.fn();

    const testExt = ExtensionFactory.create({
        manifest: { identifier: 'testExt' },
        autorun: testExtAutorunFn,
    });

    const testAnotherExt = ExtensionFactory.create({
        manifest: { identifier: 'testAnotherExt' },
        autorun: testAnotherExtAutorunFn,
    });

    @Overrides({ some: 'value' })
    @Extension(testExt, testAnotherExt)
    @DisableAutorun('testAnotherExt')
    @EventListener('extensionLoaded', extensionLoaded)
    @Extend(AbstractApplication)
    class App {
        public start() {
            startFn();
        }
    }

    it('should start not all autorun functions', async () => {
        const app = await runMetafoksApplication(App);
        const config = app.context.getConfig<any>();

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
