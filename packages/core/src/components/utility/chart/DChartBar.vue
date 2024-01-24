<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, ConceptsCount, MinMaxRange } from '../../../domains';
import { isCoding, isMinMaxRange } from '../../../domains';
import { stringToColor } from '../../../utils';

export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<ConceptsCount<MinMaxRange | Coding | string[]>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.count),
                backgroundColor: props.items.map((item) => {
                    if (isCoding(item.concept)) {
                        return `${stringToColor(item.concept.display || item.concept.code)}`;
                    }

                    if (isMinMaxRange(item.concept)) {
                        return `${stringToColor(`${(item.concept.min + item.concept.max) * 10}`)}`;
                    }

                    if (Array.isArray(item.concept)) {
                        return `${stringToColor(item.concept.join('+'))}`;
                    }

                    return undefined;
                }),
            }],
            labels: props.items.map((item) => {
                if (isCoding(item.concept)) {
                    return item.concept.display || item.concept.code;
                }

                if (isMinMaxRange(item.concept)) {
                    return `${item.concept.min}-${item.concept.max}`;
                }

                if (Array.isArray(item.concept)) {
                    return `${item.concept.join(', ')}`;
                }

                return undefined;
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
