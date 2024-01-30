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
import { generateChartBackgroundColorForKeyValueRecord, generateChartLabelsForKeyValueRecord } from './utils';

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
    },
    setup(props) {
        const data = computed<ChartData<'doughnut'>>(() => ({
            datasets: [{
                data: props.items.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    return item.value.count;
                }),
                backgroundColor: props.items.map((item) => generateChartBackgroundColorForKeyValueRecord(item)),
            }],
            labels: props.items.map((item) => {
                if (typeof item.value === 'number') {
                    return `${generateChartLabelsForKeyValueRecord(item)}`;
                }

                return `${generateChartLabelsForKeyValueRecord(item)} (${item.value.percent.toFixed(2)}%)`;
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
