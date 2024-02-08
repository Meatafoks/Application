import { createExtension, MetafoksTestingApplication, With, EventListener, containerOf } from '../src';

const testExtension = createExtension(context => {
    const config = context.getConfig<any>();

    return {
        identifier: 'test',
        autorun: async () => {
            if (config.value !== 1) throw new Error('no config');
            return new Promise(resolve => setTimeout(resolve, 100));
        },
    };
});

const badExtension = createExtension(context => {
    return {
        identifier: 'test',
        autorun: async () => {
            throw new Error('no message');
        },
    };
});

describe('extensions loader', () => {
    it('should works', async () => {
        const extensionLoadFn = jest.fn();

        @MetafoksTestingApplication()
        @With(testExtension)
        @EventListener('extensionLoaded', extensionLoadFn)
        class App {}

        const container = await containerOf(App);

        //then
        expect(container.loader.getManifest('test')).not.toBeUndefined();
        expect(extensionLoadFn).toHaveBeenCalledWith('test');
    });

    /*it('should print error', async () => {
        const startFn = jest.fn();
        const exceptionFn = jest.fn();

        try {
            @MetafoksTestingApplication()
            @With(badExtension)
            @EventListener('applicationStart', startFn)
            class App {}

            await containerOf(App);
        } catch {
            exceptionFn();
        }

        expect(exceptionFn).toHaveBeenCalled();
        expect(startFn).not.toHaveBeenCalled();
    });*/
});
