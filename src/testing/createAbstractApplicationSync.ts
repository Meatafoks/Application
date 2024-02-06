import { MetafoksAbstractContext } from './metafoksAbstractContext';
import { MetafoksRunApplication } from '../context';
import { merge } from '../utils/merge';
import { DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION } from './defaults';
import { createMainClass } from './createMainClass';
import { CreateAbstractApplicationProps } from './createAbstractApplicationProps';

export function createAbstractApplicationSync<TConfig>(props: CreateAbstractApplicationProps<TConfig> = {}) {
    const app = new MetafoksRunApplication(merge<any>(DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION, props))
        .setAppMainClass(createMainClass(props.onStart))
        .startSync();

    return new MetafoksAbstractContext(app.context);
}
