export type Constructor<T> = {
    new (...args: any[]): T;
};

export type FunctionReturning<T> = (...args: Array<any>) => T;

export type Annotation<TClass = any, ReturnType = void> = (target: Constructor<TClass>) => ReturnType;

export function createAnnotation<TClass, ReturnType>(
    annotation: (target: Constructor<TClass>) => ReturnType,
): Annotation<TClass, ReturnType> {
    return annotation;
}
