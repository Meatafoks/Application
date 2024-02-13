import { ApplicationDecorator } from '../ApplicationDecorator';
import { Context } from './ContextDecorator';

export function Mock<T>(name: string, value: T): ApplicationDecorator {
    return target => {
        Context(target);
        target.context!.addMock(name, value);
    };
}
