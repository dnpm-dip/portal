import { isObject } from '../../utils';
import type { Coding, CodingGroup } from './types';

export function isCodingGroup(input: unknown) : input is CodingGroup {
    return isObject(input) &&
        typeof input.id === 'string' &&
        Array.isArray(input.children);
}

export function toCodingGroup(items: Coding[]) : CodingGroup {
    return {
        id: items
            .map((item) => `${item.code}`)
            .sort()
            .join('::'),
        children: items,
    };
}
