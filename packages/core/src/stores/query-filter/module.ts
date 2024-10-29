/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isEqual } from 'smob';
import { ref } from 'vue';
import type { Coding } from '../../domains';
import { QueryEventBusEventName } from '../../services';
import type { StoreCreateOptions } from '../types';
import { buildQueryFiltersURLRecord } from './helper';
import type { QueryFilterGroup, QueryFilterGroupInput, QueryFilters } from './types';

const toCoding = (input: string | Coding) : Coding => {
    if (typeof input === 'string') {
        return {
            code: input,
        };
    }

    return input;
};

export function createQueryFilterStore(ctx: StoreCreateOptions) {
    const items = ref<QueryFilters>({});

    const hasGroup = (key: string, input: QueryFilterGroupInput) => {
        if (typeof items.value[key] === 'undefined' || items.value[key].length === 0) {
            return false;
        }

        let data : Coding[];
        if (Array.isArray(input)) {
            data = input.map((el) => toCoding(el));
        } else {
            data = [toCoding(input)];
        }

        for (let i = 0; i < items.value[key].length; i++) {
            if (isEqual(items.value[key][i], data)) {
                return true;
            }
        }

        return false;
    };

    const addGroup = (key: string, input: QueryFilterGroupInput) => {
        let data : Coding[];
        if (Array.isArray(input)) {
            data = input.map((el) => toCoding(el));
        } else {
            data = [toCoding(input)];
        }

        if (!items.value[key]) {
            items.value[key] = [];
        }

        items.value[key].push(data);
    };

    const reset = (key: string) => {
        items.value[key] = [];
    };

    const set = (key: string, input: QueryFilterGroupInput[]) => {
        reset(key);

        for (let i = 0; i < input.length; i++) {
            addGroup(key, input[i]);
        }

        ctx.queryEventBus.emit(QueryEventBusEventName.FILTER_UPDATED, key);
    };

    const get = (key: string) : QueryFilterGroup[] => items.value[key] || [];

    const resetAll = () => {
        items.value = {};
    };

    const commit = () => {
        ctx.queryEventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
    };

    const buildURLRecord = () => buildQueryFiltersURLRecord(items.value);

    return {
        hasGroup,
        addGroup,

        items,
        buildURLRecord,

        set,
        get,

        commit,
        resetAll,
    };
}
