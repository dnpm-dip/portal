import { polyfillClone } from 'smob';

export function clone<T>(input: T) : T {
    return polyfillClone(input);
}
