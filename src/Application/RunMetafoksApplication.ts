import { MainClass, MetafoksApplicationInstance } from '../Application';
import { ApplicationConstructor } from '../Stereotypes';

/**
 * Starts metafoks application
 *
 * @param app
 */
export async function runMetafoksApplication<T>(app: ApplicationConstructor<T>) {
    const prop = { ...app, self: app } as Required<ApplicationConstructor<MainClass>>;
    const instance = new MetafoksApplicationInstance(prop);

    return await instance.start();
}
