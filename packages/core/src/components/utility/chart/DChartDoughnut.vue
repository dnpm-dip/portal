<script lang="ts">
import type {
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecords, MinMaxRange } from '../../../domains';
import { generateChartBackgroundColorForKeyValueRecord, generateChartLabelsForKeyValueRecord } from './utils';

export default defineComponent({
    components: {
        Doughnut,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<KeyValueRecords<MinMaxRange | Coding>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'doughnut'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.value),
                backgroundColor: props.items.map((item) => generateChartBackgroundColorForKeyValueRecord(item)),
            }],
            labels: props.items.map((item) => generateChartLabelsForKeyValueRecord(item)),
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
