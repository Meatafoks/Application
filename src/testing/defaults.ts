import { CreateAbstractApplicationProps } from './createAbstractApplicationProps';

export const DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION: CreateAbstractApplicationProps = {
    config: {
        scanner: {
            enabled: false,
        },
        logger: {
            level: {
                app: 'debug',
                system: 'debug',
            },
            enabledFileWriting: false,
        },
    },
    configPath: 'test/config',
};
