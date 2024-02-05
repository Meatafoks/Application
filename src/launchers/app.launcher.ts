import { MetafoksContext } from '../context';

export function launchApp(context: MetafoksContext) {
    const app = context.resolve('app');

    if ('start' in app) {
        app.start();
        return;
    }

    if ('run' in app) {
        app.run();
    }
}
