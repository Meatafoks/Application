import { MetafoksContainerProperties, runMetafoksApplication } from '../../context';
import { ApplicationConstructor, createAnnotation } from '../../utils';
import { merge } from '../../utils/merge';
import { DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION } from '../index';

export function MetafoksTestingApplication<TConfig>(props: MetafoksContainerProperties<TConfig> = {}) {
    return createAnnotation((target: ApplicationConstructor<unknown>) => {
        runMetafoksApplication(target, merge<any>(DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION, props));
    });
}
