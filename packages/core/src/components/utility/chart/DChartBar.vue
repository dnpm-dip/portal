<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type {
    Coding, ConceptsCount, MinMaxRange, Quantities,
} from '../../../domains';
import {
    generateRandomColorTuple, getColorInRange, rgbToHex,
} from '../../../utils';
import { generateChartLabelsForKeyValueRecord } from './utils';

type Key = MinMaxRange | Coding | string[] | string;
export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<ConceptsCount<Key> | Quantities<Key>>,
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

        const [start, end] = generateRandomColorTuple(items.value.length);

        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: items.value.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    return item.value.count;
                }),
                backgroundColor: items.value.map((_, key) => rgbToHex(getColorInRange({
                    start,
                    end,
                    rangeMax: items.value.length,
                    rangeValue: key,
                }))),
            }],
            labels: items.value.map((item) => {
                if (typeof item.value === 'number') {
                    return `${generateChartLabelsForKeyValueRecord(item)}`;
                }

                return `${generateChartLabelsForKeyValueRecord(item, {
                    codingVerbose: props.codingVerboseLabel,
                })} (${item.value.percent.toFixed(1)}%)`;
            }),
        }));

        const options : ChartOptions<'bar'> = {
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
            },
        };

        return {
            data,
            options,
        };
    },
});
</script>
<template>
    <Bar
        :options="options"
        :data="data"
    />
</template>
