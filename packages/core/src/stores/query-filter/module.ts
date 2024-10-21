/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ref } from 'vue';
import type { Coding } from '../../domains';

type Filters = Record<string, Coding[]>;

const toCoding = (input: string | Coding) : Coding => {
    if (typeof input === 'string') {
        return {
            code: input,
        };
    }

    return input;
};

export function createQueryFilterStore() {
    const filters = ref<Filters>({});

    const addFilterValue = (key: string, value: string | Coding) => {
        const coding = toCoding(value);
        if (!filters.value[key]) {
            filters.value[key] = [];
        }

        const index = filters.value[key].findIndex((el) => el.code === coding.code);
        if (index !== -1) {
            return;
        }

        filters.value[key].push(coding);
    };

    const dropFilterValue = (key: string, value: string | Coding) => {
        const coding = toCoding(value);
        if (!filters.value[key]) {
            return;
        }

        const index = filters.value[key].findIndex((el) => el.code === coding.code);
        if (index !== -1) {
            filters.value[key].splice(index, 1);
        }
    };

    const setFilterValue = (key: string, value: (string | Coding)[]) => {
        filters.value[key] = value.map((el) => toCoding(el));
    };

    return {
        filters,
        addFilterValue,
        dropFilterValue,
        setFilterValue,
    };
}
