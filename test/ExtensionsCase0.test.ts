import { Extend, ExtensionFactory, Override, runMetafoksApplication, Subscribe, With } from '../src';
import { AbstractApplication } from './AbstractApplication';

const testExtension = ExtensionFactory.create({
    manifest: { identifier: 'test' },
    autorun: async context => {
        const config = context.getConfig<any>();

        if (config.value !== 1) throw new Error('no config');
        return new Promise(resolve => setTimeout(resolve, 100));
    },
});

describe('testing extensions loader simply', () => {
    const extensionLoadFn = jest.fn();

    @With(testExtension)
    @Subscribe('extensionLoaded', extensionLoadFn)
    @Extend(AbstractApplication)
    class BaseApp {}

    beforeEach(() => {
        extensionLoadFn.mockReset();
    });

    it('should throw cuz no config', async () => {
        @Extend(BaseApp)
        class App {}

        await expect(runMetafoksApplication(App)).rejects.toThrowError('no config');
        expect(extensionLoadFn).toHaveBeenCalledWith('test');
    });

    it('should works properly', async () => {
        const extensionLoadFn = jest.fn();

        @Override({ value: 1 })
        @Extend(BaseApp)
        class App {}

        await expect(runMetafoksApplication(App)).resolves.not.toThrow();
        expect(extensionLoadFn).not.toHaveBeenCalledWith('test');
    });
});
