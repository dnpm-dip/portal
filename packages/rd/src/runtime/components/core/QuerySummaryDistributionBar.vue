<script lang="ts">
import type { Coding, KeyValueRecords, MinMaxRange } from '@dnpm-dip/core';
import { isCoding, stringToColor } from '@dnpm-dip/core';
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    components: {
        Bar,
    },
    props: {
        items: {
            required: true,
            type: Array as PropType<KeyValueRecords<MinMaxRange | Coding>>,
        },
    },
    setup(props) {
        const data = computed<ChartData<'bar'>>(() => ({
            datasets: [{
                data: props.items.map((item) => item.value),
                backgroundColor: props.items.map(
                    (item) => (isCoding(item.key) ?
                        `${stringToColor(item.key.display || item.key.code)}` :
                        `${stringToColor(`${(item.key.min + item.key.max) * 10}`)}`),
                ),
            }],
            labels: props.items.map(
                (item) => (isCoding(item.key) ?
                    item.key.display || item.key.code :
                    `${item.key.min}-${item.key.max}`),
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
