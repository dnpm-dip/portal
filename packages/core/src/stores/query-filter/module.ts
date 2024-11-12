/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isEqual } from 'smob';
import { ref } from 'vue';
import { QueryEventBusEventName } from '../../services';
import type { StoreCreateOptions } from '../types';
import { buildQueryFiltersURLRecord } from './helper';
import type { QueryFilterItem, QueryFilters } from './types';

export function createQueryFilterStore(ctx: StoreCreateOptions) {
    const active = ref<string>('patient');
    const setActive = (name: string) => {
        active.value = name;
    };
    const resetActive = () => {
        active.value = 'patient';
    };

    // ----------------------------------------------------------------

    const items = ref<QueryFilters>({});

    const reset = () => {
        items.value = {};
    };

    const hasItem = (
        key: string,
        input: QueryFilterItem,
    ) => {
        if (typeof items.value[key] === 'undefined' || items.value[key].length === 0) {
            return false;
        }

        for (let i = 0; i < items.value[key].length; i++) {
            if (isEqual(items.value[key][i], input)) {
                return true;
            }
        }

        return false;
    };

    const addItem = (
        key: string,
        input: QueryFilterItem,
    ) => {
        if (!items.value[key]) {
            items.value[key] = [];
        }

        items.value[key].push(input);
    };

    const setItems = (key: string, input: QueryFilterItem[]) => {
        items.value[key] = [];

        for (let i = 0; i < input.length; i++) {
            addItem(key, input[i]);
        }

        ctx.queryEventBus.emit(QueryEventBusEventName.FILTER_UPDATED, key);
    };

    const getItems = (key: string) : QueryFilterItem[] => items.value[key] || [];

    // ----------------------------------------------------------------

    const commit = () => {
        ctx.queryEventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
    };

    const buildURLRecord = () => buildQueryFiltersURLRecord(items.value);

    return {
        active,
        setActive,
        resetActive,

        reset,

        hasItem,
        addItem,

        items,
        buildURLRecord,

        setItems,
        getItems,

        commit,
    };
}
