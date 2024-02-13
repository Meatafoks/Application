import { ApplicationDecorator, MetafoksApplicationWithProperties } from '../ApplicationDecorators';

export const TestingApplication: ApplicationDecorator = target => {
    MetafoksApplicationWithProperties({
        configurator: { configPath: 'test/config' },
        logger: { enabledFileWriting: false, level: { app: 'debug', system: 'debug' } },
    })(target);
};
