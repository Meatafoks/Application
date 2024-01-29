import { asClass, asFunction } from 'awilix';
import { getLogger } from 'log4js';
import path from 'path';

import { MetafoksContext } from '../context';

const logger = getLogger('ComponentsScan');

export function registerComponents(context: MetafoksContext) {
    const config = context.getConfig();
    logger.level = config.metafoks?.logger?.level?.system ?? 'INFO';

    const scanner = config.metafoks?.scanner ?? {};
    const services = path.resolve(scanner.service ?? './src/**/*.service.ts');
    const loaders = path.resolve(scanner.loader ?? './src/**/*.loader.ts');
    const components = path.resolve(scanner.component ?? './src/**/*.component.ts');

    const objs = context.getContainer().loadModules(
        [
            [services, { lifetime: 'SINGLETON', register: asClass }],
            [components, { lifetime: 'SINGLETON', register: asClass }],
        ],
        {
            formatName: 'camelCase',
        },
    );
    const loader = context
        .getContainer()
        .loadModules([[loaders, { lifetime: 'SINGLETON', register: asFunction }]], {
            formatName: name => name.replace('.loader', ''),
        });

    const result = { ...loader, ...objs };

    for (const name of Object.keys(result.registrations)) {
        const item = result.registrations[name];
        logger.debug(`Registered {${name}} with register {${item.register?.name}}`);
    }
}
