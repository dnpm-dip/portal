<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import { BTable } from 'bootstrap-vue-next';
import type { QueryTherapyResponse } from '../../domains';
import MTherapyResponseDistributionBar from './MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
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
                key: 'medicationClasses', label: 'Medikationsklasse', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'medications', label: 'Medikation', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'supportingVariants', label: 'Stützende Varianten', thClass: 'text-left', tdClass: 'text-left',
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
        <template #cell(medicationClasses)="data">
            <ul class="column">
                <li
                    v-for="(item,key) in data.item.medicationClasses"
                    :key="key"
                >
                    {{ item.display }}
                </li>
            </ul>
        </template>
        <template #cell(medications)="data">
            <ul class="column">
                <li
                    v-for="(item,key) in data.item.medications"
                    :key="key"
                >
                    {{ item.display }}
                </li>
            </ul>
        </template>
        <template #cell(supportingVariants)="data">
            <ul class="column">
                <li
                    v-for="(item,key) in data.item.supportingVariants"
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
