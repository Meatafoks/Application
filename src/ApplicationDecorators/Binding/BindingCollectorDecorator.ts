import { ApplicationDecorator } from '../ApplicationDecorator';
import { MetafoksApplicationInstance } from '../../Application';

export const BindingCollector: ApplicationDecorator = target => {
    MetafoksApplicationInstance.globalBindingCollector = target;
};
