/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Ref } from 'vue';

export function extendRefRecord<T extends Record<string, any>>(
    src: Ref<T>,
    input: Partial<T>,
) : Ref<T> {
    const keys = Object.keys(input) as (keyof T)[];
    for (const key of keys) {
        src.value[key] = input[key] as T[keyof T];
    }

    return src;
}
