/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isCoding, serializeCoding } from '../../domains';
import type { QueryFilterItem, QueryFilters } from './types';

export function buildQueryFilterURLValue(items: QueryFilterItem[]) {
    const output : string[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (isCoding(item)) {
            output.push(serializeCoding(item));
        } else {
            output.push(item.children
                .map((child) => serializeCoding(child)).join('+'));
        }
    }

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
