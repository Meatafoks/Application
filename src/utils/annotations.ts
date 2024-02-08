import { MetafoksContainer, MetafoksContext } from '../context';

import { contextName } from './contextName';

export type Constructor<T> = {
    new (...args: any[]): T;
    [contextName]?: string;
    context?: MetafoksContext;
};
export type ApplicationConstructor<T> = {
    new (...args: any[]): T;
    [contextName]?: string;
    context?: MetafoksContext;
    container?: MetafoksContainer;
};

export type FunctionReturning<T> = (...args: Array<any>) => T;

export type Annotation<TClass = any, ReturnType = void> = (target: Constructor<TClass>) => ReturnType;
export type MethodAnnotation<ReturnType = void> = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) => ReturnType;

export function createAnnotation<TClass, ReturnType>(
    annotation: (target: Constructor<TClass>) => ReturnType,
): Annotation<TClass, ReturnType> {
    return annotation;
}

export function createMethodAnnotation<ReturnType>(
    annotation: (target: Function, propertyKey: string, descriptor: PropertyDescriptor) => ReturnType,
): MethodAnnotation<ReturnType> {
    return annotation;
}
