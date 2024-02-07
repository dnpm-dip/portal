<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';
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
        const labels : string[] = props.items.map((item) => {
            if (typeof item.value === 'number') {
                return `${generateChartLabelsForKeyValueRecord(item)}`;
            }

            return `${generateChartLabelsForKeyValueRecord(item)} (${item.value.percent.toFixed(2)}%)`;
        });

        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: props.items.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    return item.value.count;
                }),
                backgroundColor: props.items.map((item) => generateChartBackgroundColorForKeyValueRecord(item)),
            }],
            labels,
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

        const windowWidth : Ref<number | undefined> = ref(undefined);
        if (typeof window !== 'undefined') {
            windowWidth.value = document.documentElement.clientWidth;

            window.addEventListener('resize', () => {
                windowWidth.value = document.documentElement.clientWidth;
            });
        }

        const height = computed(() => {
            if (typeof windowWidth.value === 'number') {
                if (windowWidth.value <= 1024) {
                    return 50 + labels.length * 30;
                }

                if (windowWidth.value >= 1920) {
                    return 50 + labels.length * 8;
                }
            }

            return 50 + labels.length * 10;
        });

        return {
            data,
            height,
            labels,
            options,
        };
    },
});
</script>
<template>
    <Bar
        :options="options"
        :data="data"
        :height="height"
    />
</template>
