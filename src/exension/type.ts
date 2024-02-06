import { MetafoksContext } from '../context';
import { Constructor, FunctionReturning } from '../utils';

export type MetafoksExtensionAutorunFn = (() => Promise<void>) | (() => void);

/**
 * Extension manifest information
 */
export type MetafoksExtensionManifest = {
    identifier: string;
    autorun?: MetafoksExtensionAutorunFn;

    components?: Record<string, Constructor<any>>;
    loaders?: Record<string, FunctionReturning<any>>;
};

/**
 * Metafoks application extension type
 */
export type MetafoksExtension = (context: MetafoksContext) => MetafoksExtensionManifest;
