import { MetafoksContext } from '../context';
import { MetafoksApplicationExtension } from '../exension';
import { LoggerFactory } from '../utils';

export interface ExtensionsLoaderProps {
    extensions?: MetafoksApplicationExtension[];
}

export function extensionsLoader(context: MetafoksContext, props: ExtensionsLoaderProps = {}) {
    let logger = LoggerFactory.createLoggerByName('ExtensionsLoader');

    for (const extension of props.extensions ?? []) {
        const manifest = extension(context);
        logger.info(`loaded extension with identifier=${manifest.identifier}`);

        if (manifest.autorun) {
            logger.debug(`starting autorun of extension with identifier=${manifest.identifier}`);
            manifest
                .autorun()
                .then(() => {
                    logger.info(`completed autorun of extension with identifier=${manifest.identifier}`);
                    context.trackEvent('extensionLoaded', manifest.identifier);
                })
                .catch(reason =>
                    logger.error(
                        `error in autorun function of extension with identifier=${manifest.identifier}: ${JSON.stringify(reason)}`,
                    ),
                );
        } else {
            context.trackEvent('extensionLoaded', manifest.identifier);
        }
    }
}

export function registerExtensionsLoader(context: MetafoksContext, props: ExtensionsLoaderProps = {}) {
    extensionsLoader(context, props);
}
