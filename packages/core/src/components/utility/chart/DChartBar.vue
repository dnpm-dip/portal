<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecords, MinMaxRange } from '../../../domains';
import { generateChartBackgroundColorForKeyValueRecord, generateChartLabelsForKeyValueRecord } from './utils';

export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<KeyValueRecords<MinMaxRange | Coding | string[] | string>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.value),
                backgroundColor: props.items.map((item) => generateChartBackgroundColorForKeyValueRecord(item)),
            }],
            labels: props.items.map((item) => generateChartLabelsForKeyValueRecord(item)),
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
