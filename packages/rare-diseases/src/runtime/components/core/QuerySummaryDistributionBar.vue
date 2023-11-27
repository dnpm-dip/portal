<script lang="ts">
import type { Coding, MinMaxRange } from '@dnpm-dip/core';
import { isCoding, stringToColor } from '@dnpm-dip/core';
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { ConceptsCount } from '../../domains';

export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<ConceptsCount<MinMaxRange | Coding>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.count),
                backgroundColor: props.items.map(
                    (item) => (isCoding(item.concept) ?
                        `${stringToColor(item.concept.display || item.concept.code)}` :
                        `${stringToColor(`${(item.concept.min + item.concept.max) * 10}`)}`),
                ),
            }],
            labels: props.items.map(
                (item) => (isCoding(item.concept) ?
                    item.concept.display || item.concept.code :
                    `${item.concept.min}-${item.concept.max}`),
            ),
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
