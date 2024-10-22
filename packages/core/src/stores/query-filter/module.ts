/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import type { Coding } from '../../domains';
import { serializeCoding } from '../../domains';
import { QueryEventBusEventName } from '../../services';
import type { StoreCreateOptions } from '../types';

const toCoding = (input: string | Coding) : Coding => {
    if (typeof input === 'string') {
        return {
            code: input,
        };
    }

    return input;
};

type FilterGroupInput = string | Coding | string[] | Coding[];

type FilterGroup = Coding[];
type Filters = Record<string, FilterGroup[]>;

export function createQueryFilterStore(ctx: StoreCreateOptions) {
    const items = ref<Filters>({});

    const addGroup = (key: string, input: FilterGroupInput) => {
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

    const set = (key: string, input: FilterGroupInput[]) => {
        reset(key);

        for (let i = 0; i < input.length; i++) {
            addGroup(key, input[i]);
        }

        ctx.queryEventBus.emit(QueryEventBusEventName.FILTER_UPDATED, key);
    };

    const get = (key: string) : FilterGroup[] => items.value[key] || [];

    const resetAll = () => {
        items.value = {};
    };

    const commit = () => {
        ctx.queryEventBus.emit(QueryEventBusEventName.FILTERS_COMMITED);
    };

    const buildURLRecord = () => {
        const output : Record<string, string> = {};

        const keys = Object.keys(items.value);
        for (let i = 0; i < keys.length; i++) {
            const groups : string[] = items.value[keys[i]]
                .map((group) => group
                    .map((el) => serializeCoding(el))
                    .join('+'));

            if (groups.length > 0) {
                output[keys[i]] = groups.join(',');
            }
        }

        return output;
    };

    return {
        items,
        buildURLRecord,

        set,
        get,

        commit,
        resetAll,
    };
}
