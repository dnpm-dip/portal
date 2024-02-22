<script lang="ts">
import type {
    ChartData, ChartDataset, ChartOptions, Point,
} from 'chart.js';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { Line } from 'vue-chartjs';
import { stringToColor } from '../../../utils';
import type { KMSurvivalReport } from './types';

export default defineComponent({
    components: {
        ChartLine: Line,
    },
    props: {
        report: {
            required: true,
            type: Object as PropType<KMSurvivalReport>,
        },
    },
    setup(props) {
        const datasets = computed<ChartDataset<'line'>[]>(() => props.report.data.map((item) => {
            const data : Point[] = [];

            for (let i = 0; i < item.value.survivalRates.length; i++) {
                data.push({
                    x: item.value.survivalRates[i].time,
                    y: Number(item.value.survivalRates[i].survRate.toFixed(2)),
                });
            }

            const color = stringToColor(item.key);

            return {
                type: 'line',
                label: `${item.key} (n=${item.value.survivalRates.length})`,
                backgroundColor: color,
                borderColor: color,
                fill: false,
                stepped: 'middle',
                pointHitRadius: 0,
                pointBorderWidth: 2,
                hoverBorderWidth: 2,
                pointStyle: 'cross',
                data,
            } satisfies ChartDataset<'line'>;
        }));

        const data = computed<ChartData<'line'>>(() => ({
            datasets: datasets.value,
        }));

        const options : ChartOptions<'line'> = {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    grace: '0%',
                    title: {
                        display: true,
                        align: 'center',
                        text: 'Zeit (Wochen)',
                    },
                },
                y: {
                    min: 0.0,
                    max: 1.1,
                    ticks: {
                        stepSize: 0.1,
                    },
                    title: {
                        display: true,
                        align: 'center',
                        text: 'Überlebenswahrscheinlichkeit',
                    },
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
    <ChartLine
        :options="options"
        :data="data"
    />
</template>
