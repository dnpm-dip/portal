<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecord, MinMaxRange } from '../../../domains';
import { isConceptCount } from '../../../domains';
import {
    generateRandomColorTuple, getColorInRange, rgbToHex,
} from '../../../utils';
import { DChart } from '../chart';
import { generateChartLabelsForKeyValueRecord } from '../chart/utils';

type Key = MinMaxRange | Coding | string[] | string;

export default defineComponent({
    components: {
        DChart,
    },
    props: {
        type: {
            type: String as PropType<'bar' | 'doughnut'>,
            default: 'bar',
        },
        items: {
            required: true,
            type: Array as PropType<KeyValueRecord<Key, unknown>[]>,
        },
        options: {
            type: Object as PropType<ChartOptions>,
        },
        codingVerboseLabel: {
            type: Boolean,
        },
        limit: {
            type: Number,
            default: 15,
        },
    },
    setup(props) {
        const items = computed(() => props.items.slice(0, props.limit));

        const [start, end] = generateRandomColorTuple();

        const data = computed<ChartData>(() => ({
            datasets: [{
                data: items.value.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    if (isConceptCount(item)) {
                        return item.value.count;
                    }

                    return Number(item.value);
                }) as number[],
                backgroundColor: items.value.map((_, key) => rgbToHex(getColorInRange({
                    start,
                    end,
                    rangeMax: items.value.length,
                    rangeValue: key,
                }))),
            }],
            labels: items.value.map((item) => {
                let text : string;
                if (typeof item.value === 'number') {
                    text = `${generateChartLabelsForKeyValueRecord(item)}`;
                } else if (isConceptCount(item)) {
                    text = `${generateChartLabelsForKeyValueRecord(item, {
                        codingVerbose: props.codingVerboseLabel,
                    })} (${item.value.percent.toFixed(1)}%)`;
                } else {
                    text = 'unknown';
                }

                if (text.length > 30) {
                    return `${text.substring(0, 70)}...`;
                }

                return text;
            }),
        }));

        return {
            data,
        };
    },
});
</script>
<template>
    <DChart
        :type="type"
        :data="data"
        :options="options"
    />
</template>
