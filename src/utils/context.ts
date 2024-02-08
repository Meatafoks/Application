import { ApplicationConstructor } from './annotations';
import { MetafoksContainer } from '../context';

export function contextOf<T>(clazz: ApplicationConstructor<T>) {
    return clazz.context!;
}

export function containerOf<T>(clazz: ApplicationConstructor<T>): Promise<MetafoksContainer> {
    return new Promise((resolve, reject) => {
        const container = clazz.container!;

        if (container.isStarted()) {
            resolve(container);
            return;
        }

        const timeout = setTimeout(() => {
            reject('applications starts more then 5 seconds');
        }, 5000);

        container.events.on('applicationStart', () => {
            clearTimeout(timeout);
            resolve(container);
        });
    });
}
