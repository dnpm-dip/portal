import { isObject } from '../../utils';
import type { Coding } from './types';

export function isCoding(input: unknown) : input is Coding {
    return isObject(input) &&
        typeof input.code === 'string';
}
