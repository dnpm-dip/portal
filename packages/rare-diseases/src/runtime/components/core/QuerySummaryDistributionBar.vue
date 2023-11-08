<script lang="ts">
import { stringToColor } from '@dnpm-dip/core';
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { RDQuerySummaryDistribution } from '../../domains';

export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<RDQuerySummaryDistribution>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                label: 'Anzahl',
                backgroundColor: props.items.map((item) => `${stringToColor(item.concept.display || item.concept.code)}`),
                data: props.items.map((item) => item.count),
            }],
            labels: props.items.map((item) => item.concept.display || item.concept.code),
        }));

        const options : ChartOptions<'bar'> = {
            responsive: true,
            indexAxis: 'y',
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
