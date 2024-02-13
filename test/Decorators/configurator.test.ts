import { ApplicationConstructor, Configurator, ConfiguratorProperties } from '../../src';
import { MetafoksConfigurator } from '../../src/Configurator';

describe('configurator decorators test', () => {
    it('should has main decorator', () => {
        // given
        @Configurator
        class App {}
        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.configurator).toBeInstanceOf(MetafoksConfigurator);
    });

    it('should merge properties', () => {
        // given
        @ConfiguratorProperties({ profile: 'test', configPath: 'configPath' })
        class App {}
        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.configurator).toBeInstanceOf(MetafoksConfigurator);
        expect(target.configurator!.properties.profile).toBe('test');
        expect(target.configurator!.properties.configPath).toBe('configPath');
    });
});
