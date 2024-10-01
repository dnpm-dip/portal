<script lang="ts">
import type {
    ChartData,
    ChartOptions,
} from 'chart.js';
import { merge } from 'smob';
import { Chart as VChart } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    components: {
        VChart,
    },
    props: {
        type: {
            type: String as PropType<'bar' | 'doughnut'>,
            default: 'bar',
        },
        data: {
            type: Object as PropType<ChartData>,
            required: true,
        },
        options: {
            type: Object as PropType<ChartOptions>,
        },
    },
    setup(props) {
        const optionsNormalized = computed(() => {
            let temp : ChartOptions;
            switch (props.type) {
                case 'doughnut': {
                    temp = {
                        responsive: true,
                    };
                    break;
                }
                default: {
                    temp = {
                        responsive: true,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                    };
                }
            }

            if (props.options) {
                return merge({}, props.options, temp);
            }

            return temp;
        });

        return {
            optionsNormalized,
        };
    },
});
</script>
<template>
    <VChart
        :type="type"
        :options="optionsNormalized"
        :data="data"
        style="max-height: 550px"
    />
</template>
