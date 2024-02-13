import { ConfiguratorProperties, Extend, MetafoksEnv, Profile, runMetafoksApplication } from '../src';
import { AbstractApplication } from './AbstractApplication';

describe('test profiles config selection', () => {
    it('should load config', async () => {
        @Extend(AbstractApplication)
        class App {}

        const container = await runMetafoksApplication(App);
        const config = container.context.getConfig<{ value: string }>();

        expect(config.value).toEqual('default');
    });

    it('should load test config', async () => {
        @Profile('test')
        @Extend(AbstractApplication)
        class App {}

        const container = await runMetafoksApplication(App);
        const config = container.context.getConfig<{ value: string }>();

        expect(config.value).toEqual('test');
    });

    it('should load prod config', async () => {
        @Profile('prod')
        @Extend(AbstractApplication)
        class App {}

        const container = await runMetafoksApplication(App);
        const config = container.context.getConfig<{ value: string }>();

        expect(config.value).toEqual('prod');
    });
});
