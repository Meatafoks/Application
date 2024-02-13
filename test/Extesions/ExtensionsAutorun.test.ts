import { EventListener, Extend, ExtensionFactory, runMetafoksApplication, With } from '../../src';
import { AbstractApplication } from '../AbstractApplication';

describe('extensions should autorun', () => {
    it('should call extension autorun', async () => {
        // given
        const autorunResultFn = jest.fn();
        const extensionAutorunCompletedFn = jest.fn();

        const testExtension = ExtensionFactory.create({
            manifest: { identifier: 'me.test' },
            autorun: () => {
                autorunResultFn();
            },
        });

        @EventListener('extensionAutorunCompleted', extensionAutorunCompletedFn)
        @With(testExtension)
        @Extend(AbstractApplication)
        class App {}

        await runMetafoksApplication(App);

        // then
        expect(autorunResultFn).toHaveBeenCalled();
        expect(extensionAutorunCompletedFn).toHaveBeenCalled();
    });

    it('should not call extension autorun', async () => {
        // given
        const extensionAutorunCompletedFn = jest.fn();

        const testExtension = ExtensionFactory.create({
            manifest: { identifier: 'me.test' },
        });

        @EventListener('extensionAutorunCompleted', extensionAutorunCompletedFn)
        @With(testExtension)
        @Extend(AbstractApplication)
        class App {}

        await runMetafoksApplication(App);

        // then
        expect(extensionAutorunCompletedFn).not.toHaveBeenCalled();
    });
});
