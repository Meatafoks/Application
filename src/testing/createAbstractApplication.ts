import { CreateAbstractApplicationProps } from './createAbstractApplicationProps';
import { MetafoksRunApplication } from '../context';
import { merge } from '../utils/merge';
import { DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION } from './defaults';
import { createMainClass } from './createMainClass';
import { MetafoksAbstractContext } from './metafoksAbstractContext';

export async function createAbstractApplication<TConfig>(
    props: CreateAbstractApplicationProps<TConfig> = {},
) {
    const app = await new MetafoksRunApplication(merge<any>(DEFAULT_PROPS_FOR_ABSTRACT_APPLICATION, props))
        .setAppMainClass(createMainClass(props.onStart))
        .start();

    return new MetafoksAbstractContext(app.context);
}
