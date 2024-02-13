import { MetafoksContext } from '../../Context';

export interface ExtensionManifest {
    identifier: string;
}

export type ExtensionInstall = (context: MetafoksContext) => void;
export type ExtensionAutorun =
    | ((context: MetafoksContext) => Promise<void>)
    | ((context: MetafoksContext) => void);

export type ExtensionContainer = {
    manifest: ExtensionManifest;
    install?: ExtensionInstall;
    autorun?: ExtensionAutorun;
};
