import { containerOf, EventListener, MetafoksTestingApplication } from '../src';

describe('application scanner', () => {
    const registerFn = jest.fn();

    @MetafoksTestingApplication({
        config: {
            scanner: {
                enabled: true,
                component: './test/**/*.component.ts',
                loader: './test/**/*.loader.ts',
            },
        },
    })
    @EventListener('componentRegistered', registerFn)
    class App {}

    it('should scan components', async () => {
        const container = await containerOf(App);

        expect(container.context.has('demoComponent')).toBeTruthy();
        expect(container.context.has('testlod')).toBeTruthy();

        expect(registerFn).toHaveBeenCalledWith('demoComponent');
        expect(registerFn).toHaveBeenCalledWith('testlod');
    });
});
