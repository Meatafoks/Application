import { createExtension } from '../../../src';

export const testExtension = createExtension(context => {
    const config = context.getConfig<any>();
    return {
        autorun: () => {
            console.log(`auto run test with token=${config.token}`);
        },
        identifier: 'ru.metafoks.extension.TestExtension',
    };
});
