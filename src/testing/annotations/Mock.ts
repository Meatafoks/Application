import { createAnnotation } from '../../utils';
import { MetafoksContainer } from '../../context';

export function Mock<T>(name: string, value: T) {
    return createAnnotation(target => {
        MetafoksContainer.main.context.addMock(name, value);
    });
}
