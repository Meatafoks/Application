import { MetafoksExtension } from './type';

/**
 * Declaring new extension
 * @param loader - extension function
 */
export function createExtension(loader: MetafoksExtension) {
    return loader;
}
