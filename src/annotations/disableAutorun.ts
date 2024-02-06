import { MetafoksRunApplication } from '../context';
import { Annotation, createAnnotation } from '../utils';

function DisableAutorun(flag: boolean): Annotation;
function DisableAutorun(identifier: string): Annotation;
function DisableAutorun(...identifiers: string[]): Annotation;
function DisableAutorun(identifiers: string | string[] | boolean) {
    return createAnnotation(target => {
        MetafoksRunApplication.main.configurator.configureDisableAutorun(identifiers);
    });
}

export { DisableAutorun };

/**
 * Prevents extensions autorun start
 *
 * @param identifiers
 * @constructor
 */
