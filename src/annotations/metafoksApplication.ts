import { runMetafoksApplication } from '../context';
import { Constructor } from '../utils';

export function MetafoksApplication<TClass>(target: Constructor<TClass>) {
    runMetafoksApplication(target);
}
