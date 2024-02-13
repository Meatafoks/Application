import { ApplicationConstructor } from '../Stereotypes';

/**
 * Decorator for application
 */
export type ApplicationDecorator<TClass = any, ReturnType = void> = (
    target: ApplicationConstructor<TClass>,
) => ReturnType;
