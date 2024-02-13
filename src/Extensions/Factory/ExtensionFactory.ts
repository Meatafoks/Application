import { ExtensionContainer } from './Types';

export class ExtensionFactory {
    public static create(extension: ExtensionContainer) {
        return extension;
    }
}
