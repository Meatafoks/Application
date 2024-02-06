import { CreateAbstractApplicationProps } from './createAbstractApplicationProps';

export const DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION: CreateAbstractApplicationProps = {
    config: {
        scanner: {
            enabled: false,
        },
        logger: {
            level: {
                app: 'debug',
                scanner: 'debug',
                system: 'debug',
            },
            disableFileWriting: false,
        },
    },
    configPath: 'test/config',
};
