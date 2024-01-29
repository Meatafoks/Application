import { MetafoksContext } from '../context';

export function launchApp(context: MetafoksContext) {
    context.resolve('app').start();
}
