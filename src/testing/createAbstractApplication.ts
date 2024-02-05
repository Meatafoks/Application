import { MetafoksContext } from '../context';
import { applicationLoader, ApplicationLoaderProps } from '../loaders/app.loader';
import { merge } from '../utils/merge';
import { LoggerFactory } from '../utils';
import { MetafoksAbstractContext } from './metafoksAbstractContext';

export interface CreateAbstractApplicationProps<TConfig>
    extends Omit<ApplicationLoaderProps<TConfig>, 'componentsLoader'> {
    mocks?: Record<string, any>;
}

export function createAbstractApplication<TConfig>(props: CreateAbstractApplicationProps<TConfig> = {}) {
    const context = new MetafoksContext();
    applicationLoader(context, {
        componentsLoader: { scanner: { enabled: false } },
        logger: { level: { system: 'DEBUG', app: 'DEBUG' }, disableFileWriting: true },
        config: merge(
            {
                configPath: props.config?.configPath ?? 'test/config',
                overrides: { metafoks: { logger: { level: { system: 'trace' } } } },
            },
            props.config ?? {},
        ),
        with: [
            context => {
                const mocks = props.mocks ?? {};
                const mocksKeys = Object.keys(mocks);
                for (const key of mocksKeys) {
                    LoggerFactory.app.debug(`mocking ${key}`);
                    context.addValue(key, mocks[key]);
                }
                return { identifier: '$metafoks-testing-mock-extension' };
            },
            ...(props.with ?? []),
        ],
        events: props.events,
    });

    LoggerFactory.app.info('abstract application has been started');
    props.events?.onStarted?.();
    return new MetafoksAbstractContext(context);
}
