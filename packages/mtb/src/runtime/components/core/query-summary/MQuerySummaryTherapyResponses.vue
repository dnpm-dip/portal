<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { BTable } from 'bootstrap-vue-next';
import DCodingText from '@dnpm-dip/core/components/core/coding/DCodingText';
import type { QueryTherapyResponse } from '../../../domains';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        DCodingText,
        MTherapyResponseDistributionBar,
        BTable,
    },
    props: {
        items: {
            type: Object as PropType<QueryTherapyResponse[]>,
            required: true,
        },
        busy: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const fields = [
            {
                key: 'entity', label: 'Entität', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'medications', label: 'Medikationen', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'supportingAlteration', label: 'Stützende Variante', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'count', label: 'Anzahl Therapien', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
            {
                key: 'orr', label: 'ORR (%)', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
            {
                key: 'meanDuration', label: 'Dauer in Wochen (Ø)', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
            {
                key: 'responseDistribution', label: 'Response Verteilung', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
        ];

        return {
            fields,
        };
    },
});
</script>
<template>
    <BTable
        :variant="'light'"
        :items="items"
        :fields="fields"
        :busy="busy"
        outlined
    >
        <template #cell(entity)="data">
            <DCodingText :entity="data.item.entity" />
        </template>
        <template #cell(medications)="data">
            <ul class="column">
                <li
                    v-for="(item,key) in data.item.medications"
                    :key="key"
                >
                    {{ item }}
                </li>
            </ul>
        </template>
        <template #cell(responseDistribution)="data">
            <MTherapyResponseDistributionBar :distribution="data.item.responseDistribution" />
        </template>
    </BTable>
</template>
<style scoped>
.column {
    word-break: break-all;
}
</style>
