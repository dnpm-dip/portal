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
    for (const item of items) {
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

    for (const key of Object.keys(items)) {
        const filterItems = items[key];
        if (!filterItems) {
            continue;
        }
        const value = buildQueryFilterURLValue(filterItems);
        if (value) {
            output[key] = value;
        }
    }

    return output;
}
