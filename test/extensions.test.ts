import { createExtension, createAbstractApplication } from '../src';

const testExtension = createExtension(context => {
    const config = context.getConfig<any>();
    console.log(config);

    return {
        identifier: 'test',
        autorun: async () => {
            console.log('done');
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
        // given
        const extensionLoadFn = jest.fn();
        await createAbstractApplication({
            extensions: [testExtension],
            events: { extensionLoaded: extensionLoadFn },
        });

        //then
        expect(extensionLoadFn).toHaveBeenCalledWith('test');
    });

    it('should print error', async () => {
        const startFn = jest.fn();
        const exceptionFn = jest.fn();

        try {
            await createAbstractApplication({
                extensions: [badExtension],
                onStart: startFn,
            });
        } catch {
            exceptionFn();
        }

        expect(exceptionFn).toHaveBeenCalled();
        expect(startFn).not.toHaveBeenCalled();
    });
});
