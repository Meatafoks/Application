import { MetafoksApplicationProperties } from '../context';

export interface CreateAbstractApplicationProps<TConfig = {}> extends MetafoksApplicationProperties<TConfig> {
    onStart?: () => void;
}