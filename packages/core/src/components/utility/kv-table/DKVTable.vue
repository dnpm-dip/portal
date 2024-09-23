<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import { BTable } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { KeyValueRecord } from '../../../domains';
import { isConceptCount } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../chart/utils';

export default defineComponent({
    components: {
        BTable,
    },
    props: {
        data: {
            type: Array as PropType<KeyValueRecord<any, any>[]>,
            required: true,
        },
        codingVerboseLabel: {
            type: Boolean,
        },
    },
    setup(props) {
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
                key = generateChartLabelsForKeyValueRecord(item, {
                    codingVerbose: props.codingVerboseLabel,
                });
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

        return {
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
    />
</template>
