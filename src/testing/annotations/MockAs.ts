import { createMixedAnnotation } from '../../utils';
import { MetafoksContainer } from '../../context';

export function MockAs(name: string) {
    return createMixedAnnotation((target, propertyKey, descriptor) => {
        let value: any = undefined;
        if (descriptor) {
            MetafoksContainer.main.context.addMock(name, descriptor.value.apply());
        } else {
            Object.defineProperty(target, propertyKey, {
                get: () => {
                    return value;
                },
                set: v => {
                    value = v;
                    MetafoksContainer.main.context.addMock(name, v);
                },
            });
        }
    });
}
