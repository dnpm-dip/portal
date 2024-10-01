<script lang="ts">
import type {
    ChartData, ChartOptions,
} from 'chart.js';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Coding, KeyValueRecord, MinMaxRange } from '../../../domains';
import { isConceptCount } from '../../../domains';
import {
    generateRandomColorTuple, getColorInRange, rgbToHex,
} from '../../../utils';
import { DChart } from '../chart';
import { generateChartLabelsForKeyValueRecord } from '../chart/utils';

type Key = MinMaxRange | Coding | string[] | string;

export default defineComponent({
    components: {
        DChart,
    },
    props: {
        type: {
            type: String as PropType<'bar' | 'doughnut'>,
            default: 'bar',
        },
        items: {
            required: true,
            type: Array as PropType<KeyValueRecord<Key, unknown>[]>,
        },
        options: {
            type: Object as PropType<ChartOptions>,
        },
        codingVerboseLabel: {
            type: Boolean,
        },
        limit: {
            type: Number,
            default: 25,
        },
    },
    setup(props) {
        const items = computed(() => props.items.slice(0, props.limit));
        const itemsDisplayed = computed(() => items.value.length);
        const itemsTotal = computed(() => props.items.length);
        const itemsMissing = computed(() => items.value.length < props.items.length);

        const [start, end] = generateRandomColorTuple();

        const data = computed<ChartData>(() => ({
            datasets: [{
                data: items.value.map((item) => {
                    if (typeof item.value === 'number') {
                        return item.value;
                    }

                    if (isConceptCount(item)) {
                        return item.value.count;
                    }

                    return Number(item.value);
                }) as number[],
                backgroundColor: items.value.map((_, key) => rgbToHex(getColorInRange({
                    start,
                    end,
                    rangeMax: items.value.length,
                    rangeValue: key,
                }))),
            }],
            labels: items.value.map((item) => {
                let text : string;
                if (typeof item.value === 'number') {
                    text = `${generateChartLabelsForKeyValueRecord(item)}`;
                } else if (isConceptCount(item)) {
                    text = `${generateChartLabelsForKeyValueRecord(item, {
                        codingVerbose: props.codingVerboseLabel,
                    })} (${item.value.percent.toFixed(1)}%)`;
                } else {
                    text = 'unknown';
                }

                if (text.length > 100) {
                    return `${text.substring(0, 100)}...`;
                }

                return text;
            }),
        }));

        return {
            itemsMissing,
            itemsDisplayed,
            itemsTotal,
            data,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-column gap-1">
        <template v-if="itemsMissing">
            <div class="alert alert-sm alert-warning">
                Es werden nur <strong>{{ itemsDisplayed }}/{{ itemsTotal }}</strong> Elemente angezeigt, da
                es bei mehr Elementen zu Anzeigefehlern kommt.
                Bitte wechseln Sie zur Tabellenansicht um alle Elemente zu sehen.
            </div>
        </template>
        <div>
            <DChart
                :type="type"
                :data="data"
                :options="options"
            />
        </div>
    </div>
</template>
