import { MetafoksAppConfig } from '../config';
import path from 'path';
import { getLogger } from 'log4js';
import { MetafoksContext } from '../context';
import fs from 'fs';
import { hideFieldsAndJsonify } from '../utils';
import { merge } from '../utils/merge';

const logger = getLogger('MetafoksConfigLoader');
logger.level = MetafoksContext.env('CONFIG_LOADER_LOGS_LEVEL', 'WARN');

export interface ConfigLoaderProps<TConfig = any> {
    profile?: string;
    overrides?: TConfig & MetafoksAppConfig;
    configPath?: string;
    loaderLoggerLevel?: string;
}

export function configLoader(props: ConfigLoaderProps = {}) {
    if (props.loaderLoggerLevel) logger.level = props.loaderLoggerLevel;

    const profile = props.profile ?? MetafoksContext.env('CONFIG_PROFILE');
    const configPathProp = props.configPath ?? MetafoksContext.env('CONFIG_PATH', 'config');

    const configPath = path.resolve(configPathProp);
    const configFilePath = path.resolve(configPath + '/' + getProfiledConfigName(profile));
    logger.debug(`config file path: ${configFilePath}`);

    if (!fs.existsSync(configFilePath)) {
        logger.warn('metafoks app configuration file missed');
        return () => {};
    }

    logger.debug('reading config file...');
    const configContent = String(fs.readFileSync(configFilePath, { encoding: 'utf8' }));
    const json = JSON.parse(configContent);

    if (props.overrides) {
        logger.info(`config file override with=${hideFieldsAndJsonify(props.overrides)}`);
    }

    const resultConfig = merge(json, props.overrides ?? {});

    logger.info(`config has been loaded`);
    logger.trace(JSON.stringify(resultConfig, null, 2));

    return () => resultConfig;
}

export function getProfiledConfigName(profile?: string) {
    if (profile) return `config.${profile.toLowerCase()}.json`;
    return 'config.json';
}

export function registerConfigLoader<TConfig = any>(
    context: MetafoksContext,
    props: ConfigLoaderProps<TConfig> = {},
) {
    context.addFunction('config', () => merge(configLoader(props), context.inlineConfig ?? {}));
}
