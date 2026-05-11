<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecord } from '../../../domains';
import { isCoding, isConceptCount, isMinMaxRange } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../chart/utils';
import DKVTableEntry from './DKVTableEntry.vue';

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

        const fields : TableFieldRaw[] = [
            {
                key: 'key',
                label: 'Element',
                thClass: 'text-left',
                tdClass: 'text-left',
            },
            {
                key: 'value',
                label: 'Häufigkeit',
                thClass: 'text-center',
                tdClass: 'text-center',
            },
            {
                key: 'percent',
                label: 'Prozent (%)',
                thClass: 'text-center',
                tdClass: 'text-center',
            },
        ];

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
    <BTable
        :items="items"
        :fields="fields"
        outlined
    >
        <template #cell(key)="cell">
            <DKVTableEntry
                :data="(cell.item as any)"
                :clickable="clickable"
                :coding-verbose-label="codingVerboseLabel"
                @item-clicked="handleItemClick"
                @clicked="handleClicked"
            />
        </template>
    </BTable>
</template>
