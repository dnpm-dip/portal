/*
 * Copyright (c) 2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type DKVTableColumnKey = 'key' | 'value' | 'percent';

export type DKVTableColumn = {
    key: DKVTableColumnKey;
    label?: string;
};

export type DKVTableColumnsFn = (level: number) => DKVTableColumn[];
