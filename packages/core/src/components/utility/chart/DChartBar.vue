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
import { generateChartBackgroundColorForKeyValueRecord, generateChartLabelsForKeyValueRecord } from './utils';

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
    },
    setup(props) {
        const items = computed(() => props.items.slice(0, 15));

        const data = computed<ChartData<'bar' | 'doughnut'>>(() => ({
            datasets: [{
                data: items.value.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    return item.value.count;
                }),
                backgroundColor: props.items.map((item) => generateChartBackgroundColorForKeyValueRecord(item)),
            }],
            labels: items.value.map((item) => {
                if (typeof item.value === 'number') {
                    return `${generateChartLabelsForKeyValueRecord(item)}`;
                }

                return `${generateChartLabelsForKeyValueRecord(item)} (${item.value.percent.toFixed(2)}%)`;
            }),
        }));

        const options : ChartOptions<'bar' | 'doughnut'> = {
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
