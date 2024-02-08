import { MetafoksContainerProperties } from '../context';

export interface CreateAbstractApplicationProps<TConfig = {}> extends MetafoksContainerProperties<TConfig> {
    onStart?: () => void;
}
