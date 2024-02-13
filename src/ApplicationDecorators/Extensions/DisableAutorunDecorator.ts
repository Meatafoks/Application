import { ApplicationDecorator } from '../ApplicationDecorator';
import { Extensions } from './ExtensionsDecorator';

function DisableAutorun(flag: boolean): ApplicationDecorator;
function DisableAutorun(identifier: string): ApplicationDecorator;
function DisableAutorun(identifiers: string[]): ApplicationDecorator;

/**
 * Prevents extensions autorun start
 
 */

function DisableAutorun(disabled: string | string[] | boolean): ApplicationDecorator {
    return target => {
        Extensions(target);
        target.extensions!.disableAutorun(disabled);
    };
}

export { DisableAutorun };
