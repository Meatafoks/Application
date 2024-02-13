import { Extend, ExtensionFactory, runMetafoksApplication, With } from '../../src';
import { AbstractApplication } from '../AbstractApplication';

describe('extensions should install', () => {
    const autorunResultFn = jest.fn();

    const testExtension = ExtensionFactory.create({
        manifest: { identifier: 'me.test' },
        install: context => {
            context.addValue('result', { value: 1 });
        },
        autorun: context => {
            autorunResultFn(context.resolve('result').value);
        },
    });

    @With(testExtension)
    @Extend(AbstractApplication)
    class App {}

    it('should add items to context', async () => {
        const container = await runMetafoksApplication(App);

        // when
        const result = container.context.resolve('result');

        // then
        expect(result.value).toEqual(1);
        expect(autorunResultFn).toHaveBeenCalledWith(1);
    });
});
