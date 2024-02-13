import {
    ApplicationConstructor,
    ExtensionFactory,
    Extensions,
    ExtensionsAutorunProperties,
    ExtensionsProperties,
    MetafoksExtensions,
    With,
    Without,
} from '../../src';

describe('extensions decorators test', () => {
    const testExtension = ExtensionFactory.create({
        manifest: { identifier: 'test.extension' },
    });
    const anotherExtension = ExtensionFactory.create({
        manifest: { identifier: 'another.extension' },
    });

    it('should has main decorator', () => {
        // given
        @Extensions
        class App {}

        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.extensions).toBeInstanceOf(MetafoksExtensions);
    });

    it('should merge properties', () => {
        // given
        @ExtensionsProperties({ enabled: false })
        class App {}

        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.extensions).toBeInstanceOf(MetafoksExtensions);
        expect(target.extensions!.properties.enabled).toBe(false);
    });

    it('should merge autorun properties', () => {
        // given
        @ExtensionsProperties({ enabled: false })
        @ExtensionsAutorunProperties({ disabled: ['identifier'] })
        class App {}

        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.extensions).toBeInstanceOf(MetafoksExtensions);
        expect(target.extensions!.properties.enabled).toBe(false);
        expect(target.extensions!.properties.autorun.disabled).toEqual(['identifier']);
    });

    it('should collect extension', () => {
        // given
        @With(anotherExtension)
        @With(testExtension)
        class App {}

        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.extensions!.extensionsIdentifiersMap['test.extension']).not.toBeUndefined();
        expect(target.extensions!.extensionsIdentifiersMap['another.extension']).not.toBeUndefined();
    });

    it('should remove extension', () => {
        // given
        @Without(testExtension)
        @With(anotherExtension)
        @With(testExtension)
        class App {}

        const target = App as ApplicationConstructor<App>;

        // then
        expect(target.extensions!.extensionsIdentifiersMap['test.extension']).toBeUndefined();
        expect(target.extensions!.extensionsIdentifiersMap['another.extension']).not.toBeUndefined();
    });
});
