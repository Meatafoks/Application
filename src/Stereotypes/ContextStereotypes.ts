import { MetafoksContext } from '../Context';

export interface HasContext {
    content: MetafoksContext;
}

export interface MaybeHasContext {
    context?: MetafoksContext;
}
