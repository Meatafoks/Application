import { MetafoksContext } from './index';
import { launchApp } from '../launchers/app.launcher';
import { LoggerFactory } from '../utils';
import { applicationLoader, ApplicationLoaderProps } from '../loaders/app.loader';

export function runMetafoksApplication(mainClass: any, options: ApplicationLoaderProps = {}) {
    const container = MetafoksContext.getContext();
    container.addClass('app', mainClass);

    applicationLoader(container, options);
    launchApp(container);

    LoggerFactory.app.info('application did start');
    options.events?.onStarted?.();

    return container;
}
