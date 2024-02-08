import { MetafoksExtension } from '../exension';
import { MetafoksContainer } from '../context';
import { createAnnotation } from '../utils';

/**
 * Adds extension to metafoks application
 *
 * @param extensions - extension or array of extensions to load
 */
export function Extension(...extensions: MetafoksExtension[]) {
    return createAnnotation(target => {
        MetafoksContainer.main.loader.addExtensions(extensions);
    });
}

/**
 * Adds extension to metafoks application
 *
 * @param extension - extension or array of extensions to load
 * @see Extension
 */
export const With = Extension;

/**
 * Adds extension to metafoks application
 *
 * @param extension - extension or array of extensions to load
 * @see Extension
 */
export const Extensions = Extension;
