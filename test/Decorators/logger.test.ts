import { ApplicationConstructor, Logger, LoggerLevel, LoggerNoFiles, LoggerProperties } from '../../src';

describe('logger decorator', () => {
    it('should add logger', async () => {
        @Logger
        class App {}
        const target = App as ApplicationConstructor<App>;

        expect(target.logger).not.toBeUndefined();
    });

    it('should add logger properties', async () => {
        @LoggerProperties({ enabledFileWriting: false, level: { app: 'debug' } })
        class App {}
        const target = App as ApplicationConstructor<App>;

        expect(target.logger).not.toBeUndefined();
        expect(target.logger!.properties.level.app).toEqual('debug');
        expect(target.logger!.properties.enabledFileWriting).toEqual(false);
    });

    it('should add logger properties level', async () => {
        @LoggerLevel('app', 'trace')
        class App {}
        const target = App as ApplicationConstructor<App>;

        expect(target.logger).not.toBeUndefined();
        expect(target.logger!.properties.level.app).toEqual('trace');
    });

    it('should disable file writing', async () => {
        @LoggerLevel('app', 'trace')
        @LoggerNoFiles
        class App {}
        const target = App as ApplicationConstructor<App>;

        expect(target.logger).not.toBeUndefined();
        expect(target.logger!.properties.level.app).toEqual('trace');
        expect(target.logger!.properties.enabledFileWriting).toEqual(false);
    });
});
