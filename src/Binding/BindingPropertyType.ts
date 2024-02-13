export interface BindingPropertyType {
    (...args: any[]): any;

    bindingName: string;
    parentContextName: () => string | undefined;
}
