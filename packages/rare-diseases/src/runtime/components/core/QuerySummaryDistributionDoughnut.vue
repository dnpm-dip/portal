<script lang="ts">
import { stringToColor } from '@dnpm-dip/core';
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { RDQuerySummaryDistribution } from '../../domains';

export default defineComponent({
    components: {
        Doughnut,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<RDQuerySummaryDistribution>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'doughnut'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.count),
                backgroundColor: props.items.map((item) => `${stringToColor(item.concept.display || item.concept.code)}`),
            }],
            labels: props.items.map((item) => item.concept.display || item.concept.code),
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
