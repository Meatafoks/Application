import { ComponentConstructor } from '../Stereotypes';

/**
 * Decorator for components
 */
export type ComponentDecorator<TClass = any, ReturnType = void> = (
    target: ComponentConstructor<TClass>,
) => ReturnType;
