import { MetafoksContext } from '../context';

/**
 * Extension manifest information
 */
export type MetafoksApplicationExtensionManifest = {
    identifier: string;
    autorun?: () => Promise<void>;
};

/**
 * Metafoks application extension type
 */
export type MetafoksApplicationExtension = (context: MetafoksContext) => MetafoksApplicationExtensionManifest;
