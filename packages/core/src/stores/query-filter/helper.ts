/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { serializeCoding } from '../../domains';
import type { QueryFilterGroup, QueryFilters } from './types';

export function buildQueryFilterURLValue(items: QueryFilterGroup[]) {
    const output = items
        .map((group) => group
            .map((el) => serializeCoding(el))
            .join('+'));

    if (output.length > 0) {
        return output.join(',');
    }

    return undefined;
}

export function buildQueryFiltersURLRecord(items: QueryFilters) {
    const output : Record<string, string> = {};

    const keys = Object.keys(items);
    for (let i = 0; i < keys.length; i++) {
        const value = buildQueryFilterURLValue(items[keys[i]]);
        if (value) {
            output[keys[i]] = value;
        }
    }

    return output;
}
