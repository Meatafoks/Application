import { MetafoksContext } from './index';
import { registerMetafoksAppConfigLoader } from '../registers/config.register';
import { registerLoggerFactory } from '../registers/logger.register';
import { registerComponents } from '../registers/components.register';
import { launchApp } from '../launchers/app.launcher';
import { LoggerFactory } from '../utils';

export interface RunMetafoksApplicationOptions {
    with?: Array<(context: MetafoksContext) => void | Promise<void>>;
}

export async function runMetafoksApplication(mainClass: any, options: RunMetafoksApplicationOptions = {}) {
    const container = MetafoksContext.getContext();
    container.addClass('app', mainClass);

    registerMetafoksAppConfigLoader(container);
    registerLoggerFactory(container);
    registerComponents(container);

    for (const extension of options.with ?? []) {
        await extension(container);
    }

    launchApp(container);
    LoggerFactory.app.info('application did start');

    return container;
}
