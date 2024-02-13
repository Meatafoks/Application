import { BindingValue } from '../MethodDecorators';

export type ComponentOrBinding<Type> = Type | BindingValue<Type>;
