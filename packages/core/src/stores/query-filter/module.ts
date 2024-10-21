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

export function createQueryFilterStore(options: StoreCreateOptions) {
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
    };

    const resetAll = () => {
        items.value = {};
    };

    const commit = () => {
        options.queryEventBus.emit(QueryEventBusEventName.FILTERS_UPDATED);
    };

    const buildURLRecord = () => {
        const output : Record<string, string> = {};

        const keys = Object.keys(items.value);
        for (let i = 0; i < keys.length; i++) {
            const groups = items.value[keys[i]];
            const parts : string[] = [];
            for (let j = 0; j < groups.length; j++) {
                const part = groups[j].map((el) => serializeCoding(el)).join('+');
                parts.push(part);
            }

            output[keys[i]] = parts.join(',');
        }

        return output;
    };

    return {
        items,
        buildURLRecord,

        set,

        commit,
        resetAll,
    };
}
