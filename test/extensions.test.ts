import { createAbstractApplication, createExtension } from '../src';

const testExtension = createExtension(context => {
    return {
        identifier: 'test',
        autorun: async () => {
            console.log('done');
            return new Promise(resolve => setTimeout(resolve, 300));
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
        const app = createAbstractApplication({
            with: [testExtension],
            events: { onExtensionLoaded: extensionLoadFn },
        });

        //then
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(extensionLoadFn).toHaveBeenCalledWith('test');
    });

    it('should print error', async () => {
        // given
        const extensionLoadFn = jest.fn();
        const app = createAbstractApplication({
            with: [badExtension],
            events: { onExtensionLoaded: extensionLoadFn },
        });

        //then
        await new Promise(resolve => setTimeout(resolve, 600));
        expect(extensionLoadFn).not.toHaveBeenCalledWith('test');
    });
});
