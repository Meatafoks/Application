export interface Reflection {
    has(name: string): boolean;
    resolve<T>(name: string): T;
}
