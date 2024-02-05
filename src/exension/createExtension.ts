import { MetafoksApplicationExtension } from './type';

/**
 * Declaring new extension
 * @param loader - extension function
 */
export function createExtension(loader: MetafoksApplicationExtension) {
    return loader;
}
