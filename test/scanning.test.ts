import { createAbstractApplicationSync } from '../src';

describe('application scanner', () => {
    const registerFn = jest.fn();
    const app = createAbstractApplicationSync({
        config: {
            scanner: {
                enabled: true,
                component: './test/**/*.component.ts',
                loader: './test/**/*.loader.ts',
            },
        },
        events: { componentRegistered: registerFn },
    });

    it('should scan components', () => {
        expect(app.getContext().has('demoComponent')).toBeTruthy();
        expect(app.getContext().has('testlod')).toBeTruthy();

        expect(registerFn).toHaveBeenCalledWith('demoComponent');
        expect(registerFn).toHaveBeenCalledWith('testlod');
    });
});
