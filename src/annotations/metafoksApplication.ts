import { runMetafoksApplication } from '../context';
import { RunMetafoksApplicationOptions } from '../context/runMetafoksApplication';

export function MetafoksApplication(options: RunMetafoksApplicationOptions = {}) {
    return (target: any) => {
        runMetafoksApplication(target, options);
    };
}
