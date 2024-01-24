<script lang="ts">
import type {
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { stringToColor } from '../../../utils';
import { isCoding } from '../../../domains';
import type { Coding, ConceptsCount, MinMaxRange } from '../../../domains';

export default defineComponent({
    components: {
        Doughnut,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<ConceptsCount<MinMaxRange | Coding>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'doughnut'>>(() => ({
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
