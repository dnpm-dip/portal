<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { TableColumn } from '@vuecs/table';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecord } from '../../../domains';
import { isCoding, isConceptCount, isMinMaxRange } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../chart/utils';
import DKVTableEntry from './DKVTableEntry.vue';
import type { DKVTableColumnKey, DKVTableColumnsFn } from './types';

const COLUMN_DEFAULTS: Record<DKVTableColumnKey, {
    label: string;
    headerClass: string;
    cellClass: string;
}> = {
    key: {
        label: 'Element',
        headerClass: 'text-left',
        cellClass: 'text-left',
    },
    value: {
        label: 'Häufigkeit',
        headerClass: 'text-center',
        cellClass: 'text-center',
    },
    percent: {
        label: 'Prozent (%)',
        headerClass: 'text-center',
        cellClass: 'text-center',
    },
};

export default defineComponent({
    components: { DKVTableEntry },
    props: {
        data: {
            type: Array as PropType<KeyValueRecord<unknown, unknown>[]>,
            required: true,
        },
        codingVerboseLabel: { type: Boolean },
        clickable: {
            type: Boolean,
            default: false,
        },
        keyLabel: {
            type: String,
            default: COLUMN_DEFAULTS.key.label,
        },
        valueLabel: {
            type: String,
            default: COLUMN_DEFAULTS.value.label,
        },
        percentLabel: {
            type: String,
            default: COLUMN_DEFAULTS.percent.label,
        },
        keyHidden: {
            type: Boolean,
            default: false,
        },
        valueHidden: {
            type: Boolean,
            default: false,
        },
        percentHidden: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Function as PropType<DKVTableColumnsFn>,
            default: undefined,
        },
        level: {
            type: Number,
            default: 0,
        },
    },
    emits: ['clicked'],
    setup(props, { emit }) {
        const items = computed<{
            key: string,
            value: number | string,
            percent: number | string
        }[]>(() => props.data.map((item) => {
            let key : string;
            let value : number | string;
            let percent : number | string;

            if (typeof item.value === 'number') {
                key = `${generateChartLabelsForKeyValueRecord(item)}`;
                value = item.value.toFixed(2);
                percent = '?%';
            } else if (isConceptCount(item)) {
                key = `${generateChartLabelsForKeyValueRecord(item, { codingVerbose: props.codingVerboseLabel })}`;
                value = item.value.count.toFixed(2);
                percent = `${item.value.percent.toFixed(1)}%`;
            } else {
                key = 'unknown';
                value = Number(item.value);
                percent = '?%';
            }

            return {
                key,
                value,
                percent,
                ...(item.children ? { children: item.children } : {}),
            };
        }));

        const fields = computed<TableColumn[]>(() => {
            if (props.columns) {
                return props.columns(props.level).map((column) => {
                    const defaults = COLUMN_DEFAULTS[column.key];
                    return {
                        key: column.key,
                        label: column.label ?? defaults.label,
                        headerClass: defaults.headerClass,
                        cellClass: defaults.cellClass,
                    };
                });
            }

            const result: TableColumn[] = [];
            if (!props.keyHidden) {
                result.push({
                    key: 'key',
                    label: props.keyLabel,
                    headerClass: COLUMN_DEFAULTS.key.headerClass,
                    cellClass: COLUMN_DEFAULTS.key.cellClass,
                });
            }
            if (!props.valueHidden) {
                result.push({
                    key: 'value',
                    label: props.valueLabel,
                    headerClass: COLUMN_DEFAULTS.value.headerClass,
                    cellClass: COLUMN_DEFAULTS.value.cellClass,
                });
            }
            if (!props.percentHidden) {
                result.push({
                    key: 'percent',
                    label: props.percentLabel,
                    headerClass: COLUMN_DEFAULTS.percent.headerClass,
                    cellClass: COLUMN_DEFAULTS.percent.cellClass,
                });
            }
            return result;
        });

        const handleClicked = (items: Coding[]) => {
            emit('clicked', items);
        };

        const handleItemClick = (key: string) => {
            const index = items.value.findIndex((el) => el.key === key);
            if (index === -1) {
                return;
            }

            const record = props.data[index];
            if (!record) {
                return;
            }
            const itemKey = record.key;

            if (isCoding(itemKey)) {
                emit('clicked', [{ ...itemKey }]);

                return;
            }

            if (isMinMaxRange(itemKey)) {
                emit('clicked', [{ code: itemKey.min }, { code: itemKey.max }]);
                return;
            }

            if (typeof itemKey === 'string') {
                emit('clicked', [{ code: itemKey } satisfies Coding]);
                return;
            }

            const value : Coding[] = [];
            if (Array.isArray(itemKey)) {
                for (const k of itemKey) {
                    if (isCoding(k)) {
                        value.push(k);
                        continue;
                    }

                    if (typeof k === 'string') {
                        value.push({ code: k });
                    }
                }
            }

            if (value.length > 0) {
                emit('clicked', value);
            }
        };

        return {
            handleItemClick,
            handleClicked,

            fields,
            items,
        };
    },
});
</script>
<template>
    <VCTable
        :data="items"
        :columns="fields"
        bordered
    >
        <template #cell-key="{ row }: { row: any }">
            <DKVTableEntry
                :data="(row as any)"
                :clickable="clickable"
                :coding-verbose-label="codingVerboseLabel"
                :key-label="keyLabel"
                :value-label="valueLabel"
                :percent-label="percentLabel"
                :key-hidden="keyHidden"
                :value-hidden="valueHidden"
                :percent-hidden="percentHidden"
                :columns="columns"
                :level="level"
                @item-clicked="handleItemClick"
                @clicked="handleClicked"
            />
        </template>
        <VCTableEmpty />
    </VCTable>
</template>
