import { runMetafoksApplication } from '../context';
import { ApplicationLoaderProps } from '../loaders/app.loader';

export function MetafoksApplication(options: ApplicationLoaderProps = {}) {
    return (target: any) => {
        runMetafoksApplication(target, options);
    };
}
