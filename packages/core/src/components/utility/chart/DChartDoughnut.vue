<script lang="ts">
import type {
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type {
    Coding, ConceptsCount, MinMaxRange, Quantities,
} from '../../../domains';
import { generateRandomColorTuple, getColorInRange, rgbToHex } from '../../../utils';
import { generateChartLabelsForKeyValueRecord } from './utils';

type Key = MinMaxRange | Coding | string[] | string;

export default defineComponent({
    components: {
        Doughnut,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<ConceptsCount<Key> | Quantities<Key>>,
        },
        limit: {
            type: Number,
            default: 15,
        },
    },
    setup(props) {
        const items = computed(() => props.items.slice(0, props.limit));

        const [start, end] = generateRandomColorTuple(items.value.length);

        const data = computed<ChartData<'doughnut'>>(() => ({
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

                return `${generateChartLabelsForKeyValueRecord(item)} (${item.value.percent.toFixed(1)}%)`;
            }),
        }));

        const options : ChartOptions<'doughnut'> = {
            responsive: true,
        };

        return {
            data,
            options,
        };
    },
});
</script>
<template>
    <Doughnut
        :options="options"
        :data="data"
    />
</template>
