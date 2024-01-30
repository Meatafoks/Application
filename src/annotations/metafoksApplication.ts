import { runMetafoksApplication } from '../context';
import { RunMetafoksApplicationOptions } from '../context/runMetafoksApplication';
import { LoggerFactory } from '../utils';

export function MetafoksApplication(options: RunMetafoksApplicationOptions = {}) {
    return (target: any) => {
        runMetafoksApplication(target, options).then().catch(LoggerFactory.app.error);
    };
}
