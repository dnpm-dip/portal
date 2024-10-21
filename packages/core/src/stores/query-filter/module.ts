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

type Filters = Record<string, Coding[]>;

const toCoding = (input: string | Coding) : Coding => {
    if (typeof input === 'string') {
        return {
            code: input,
        };
    }

    return input;
};

export function createQueryFilterStore(options: StoreCreateOptions) {
    const items = ref<Filters>({});

    const addValue = (key: string, value: string | Coding) => {
        const coding = toCoding(value);
        if (!items.value[key]) {
            items.value[key] = [];
        }

        const index = items.value[key].findIndex((el) => el.code === coding.code);
        if (index !== -1) {
            return;
        }

        items.value[key].push(coding);
    };

    const dropValue = (key: string, value: string | Coding) => {
        const coding = toCoding(value);
        if (!items.value[key]) {
            return;
        }

        const index = items.value[key].findIndex((el) => el.code === coding.code);
        if (index !== -1) {
            items.value[key].splice(index, 1);
        }
    };

    const setValue = (key: string, value: (string | Coding)[]) => {
        items.value[key] = value.map((el) => toCoding(el));
    };

    const reset = (key?: string) => {
        if (typeof key === 'string') {
            items.value[key] = [];
            return;
        }

        items.value = {};
    };

    const commit = () => {
        // todo: this is a placeholder
        options.queryEventBus.emit(QueryEventBusEventName.FILTERS_UPDATED, items.value);
    };

    const buildURLRecord = () => {
        const output : Record<string, string> = {};

        const keys = Object.keys(items.value);
        for (let i = 0; i < keys.length; i++) {
            const value = items.value[keys[i]];

            output[keys[i]] = value
                .map((el) => serializeCoding(el))
                .join(',');
        }

        return output;
    };

    return {
        items,
        buildURLRecord,

        addValue,
        dropValue,
        setValue,

        commit,
        reset,
    };
}
