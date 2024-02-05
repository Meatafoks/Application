import { createAbstractApplication } from '../src';
import { registerComponentsLoader } from '../src/loaders/components.loader';

describe('application scanner', () => {
    const registerFn = jest.fn();
    const app = createAbstractApplication();

    it('should scan components', () => {
        // given
        app.getContext().on('componentRegistered', registerFn);

        // when
        registerComponentsLoader(app.getContext(), {
            scanner: {
                enabled: true,
                component: './test/**/*.component.ts',
            },
        });

        // then
        expect(registerFn).toHaveBeenCalledWith('demoComponent');
    });
});
