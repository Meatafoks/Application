import { ApplicationDecorator } from '../ApplicationDecorator';
import { ExtensionContainer } from '../../Extensions';
import { Extensions } from './ExtensionsDecorator';

/**
 * Adds extension to metafoks application
 *
 * @param extensions - extension or array of extensions to load
 */
export function Extension(...extensions: ExtensionContainer[]): ApplicationDecorator {
    return target => {
        Extensions(target);
        target.extensions!.add(...extensions);
    };
}

export const With = Extension;

/**
 * Removes extension to metafoks application
 *
 * @param extensions - extension or array of extensions to load
 */
export function RemoveExtension(...extensions: ExtensionContainer[]): ApplicationDecorator {
    return target => {
        Extensions(target);
        target.extensions!.remove(...extensions);
    };
}

export const Without = RemoveExtension;
