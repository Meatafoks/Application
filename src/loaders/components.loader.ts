import { MetafoksContext, MetafoksEnvKey } from '../context';
import { LoggerFactory } from '../utils';
import { asClass, asFunction } from 'awilix';
import { GlobWithOptions } from 'awilix/lib/list-modules';
import path from 'path';
import { ApplicationComponentLoadedEvent } from '../events';

export interface ComponentsLoaderProps {
    loggerLever?: string;
    scanner?: {
        enabled?: boolean;
        service?: string | string[];
        component?: string | string[];
        loader?: string | string[];
    };
}

const logger = LoggerFactory.createLoggerByName('ComponentsScan');

export function componentsLoader(context: MetafoksContext, props: ComponentsLoaderProps = {}) {
    const config = context.getConfig();
    logger.level = props.loggerLever ?? config.metafoks?.logger?.level?.system ?? 'INFO';

    if (props.scanner?.enabled === false) {
        logger.debug('components scanned is disabled');
        return;
    }

    const scanner = config.metafoks?.scanner ?? {};
    const services = getServicePaths(props.scanner?.service, scanner.service);
    const loaders = getLoaderPaths(props.scanner?.loader, scanner.loader);
    const components = getComponentPaths(props.scanner?.component, scanner.component);

    const objs = context
        .getContainer()
        .loadModules(
            [
                ...services.map<GlobWithOptions>(it => [it, { lifetime: 'SINGLETON', register: asClass }]),
                ...components.map<GlobWithOptions>(it => [it, { lifetime: 'SINGLETON', register: asClass }]),
            ],
            {
                formatName: 'camelCase',
            },
        );

    const loader = context
        .getContainer()
        .loadModules(
            [...loaders.map<GlobWithOptions>(it => [it, { lifetime: 'SINGLETON', register: asFunction }])],
            {
                formatName: name => name.replace('.loader', ''),
            },
        );

    const result = { ...loader, ...objs };

    for (const name of Object.keys(result.registrations)) {
        const item = result.registrations[name];
        context.trackEvent('componentRegistered', name);
        logger.debug(`registered {${name}} with register {${item.register?.name}}`);
    }

    logger.info(`components scanning done`);
}

export function registerComponentsLoader(context: MetafoksContext, props: ComponentsLoaderProps = {}) {
    componentsLoader(context, props);
}

function getServicePaths(localConfig?: string | string[], globalConfig?: string | string[]) {
    return getPaths({
        localConfig,
        globalConfig,
        defaults: ['./src/**/*.service.ts'],
        env: 'SCANNER_SERVICE_PATTERN',
        forWhat: 'services',
    });
}

function getComponentPaths(localConfig?: string | string[], globalConfig?: string | string[]) {
    return getPaths({
        localConfig,
        globalConfig,
        defaults: ['./src/**/*.component.ts'],
        env: 'SCANNER_COMPONENT_PATTERN',
        forWhat: 'components',
    });
}

function getLoaderPaths(localConfig?: string | string[], globalConfig?: string | string[]) {
    return getPaths({
        localConfig,
        globalConfig,
        defaults: ['./src/**/*.loader.ts'],
        env: 'SCANNER_LOADER_PATTERN',
        forWhat: 'loaders',
    });
}

function getPaths(props: {
    localConfig?: string | string[];
    globalConfig?: string | string[];
    forWhat: string;
    env: MetafoksEnvKey;
    defaults: string[];
}): string[] {
    const { localConfig, globalConfig } = props;

    if (localConfig) {
        logger.warn(
            `${props.forWhat} loading pattern overridden by run props: ${JSON.stringify(localConfig)}`,
        );
        return localConfig instanceof Array ? localConfig : [localConfig];
    }

    const env = MetafoksContext.env<string | string[]>(props.env);
    if (env) {
        logger.debug(`${props.forWhat} loading pattern overridden BY ENV: ${JSON.stringify(env)}`);
        return env instanceof Array ? env : [env];
    }

    if (globalConfig) {
        logger.debug(
            `${props.forWhat} loading pattern overridden configuration file: ${JSON.stringify(globalConfig)}`,
        );

        return globalConfig instanceof Array ? globalConfig : [globalConfig];
    }

    return props.defaults.map(it => path.resolve(it));
}
