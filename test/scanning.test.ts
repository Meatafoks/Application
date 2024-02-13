import { ComponentsScanProperties, EventListener, Extend, runMetafoksApplication } from '../src';
import { AbstractApplication } from './AbstractApplication';

describe('application scanner', () => {
    const registerFn = jest.fn();

    @ComponentsScanProperties({
        enabled: true,
        componentsGlob: './test/**/*.component.ts',
        loadersGlob: './test/**/*.loader.ts',
    })
    @EventListener('componentRegistered', registerFn)
    @Extend(AbstractApplication)
    class App {}

    it('should scan components', async () => {
        const container = await runMetafoksApplication(App);

        expect(container.context.has('demoComponent')).toBeTruthy();
        expect(container.context.has('testlod')).toBeTruthy();

        expect(registerFn).toHaveBeenCalledWith('demoComponent');
        expect(registerFn).toHaveBeenCalledWith('testlod');
    });
});
