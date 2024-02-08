import { runMetafoksApplication } from '../context';
import { ApplicationConstructor } from '../utils';

export function MetafoksApplication<TClass>(target: ApplicationConstructor<TClass>) {
    runMetafoksApplication(target);
}
