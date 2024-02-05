import fs from 'fs';
import { getLogger } from 'log4js';
import path from 'path';

import { hideFieldsAndJsonify } from '../utils';

import { MetafoksContext } from '../context';

const logger = getLogger('MetafoksAppConfigLoader');
logger.level = 'WARN';

export function metafoksAppConfigLoader(props: { profile?: string }) {
    logger.debug('loading metafoks app configuration file');

    const configPath = path.resolve('config/config.json');
    logger.debug(`config path: ${configPath}`);

    if (!fs.existsSync(configPath)) {
        logger.warn('metafoks app configuration file missed');
        return;
    }

    const configContent = String(fs.readFileSync(configPath, { encoding: 'utf8' }));
    const json = JSON.parse(configContent);

    logger.info(`config has been loaded`);
    logger.trace(hideFieldsAndJsonify(json, true));

    return json;
}

export function registerMetafoksAppConfigLoader(container: MetafoksContext) {
    if (container.inlineConfig) {
        container.addValue('config', container.inlineConfig);
    } else {
        container.addFunction('config', metafoksAppConfigLoader);
    }
}
