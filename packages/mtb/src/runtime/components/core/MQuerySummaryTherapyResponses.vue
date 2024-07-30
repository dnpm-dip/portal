<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import { BTable } from 'bootstrap-vue-next';
import MQueryTherapyResponses from './MQueryTherapyResponses';
import MTherapyResponseDistributionBar from './MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        MTherapyResponseDistributionBar,
        MQueryTherapyResponses,
        BTable,
    },
    props: {
        queryId: {
            type: String,
            required: true,
        },
        queryFilters: {
            type: Object as PropType<URLQueryRecord>,
        },
        queryUpdatedAt: {
            type: String,
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
    <MQueryTherapyResponses
        :query-id="queryId"
        :query-updated-at="queryUpdatedAt"
    >
        <template #default="props">
            <BTable
                :variant="'light'"
                :items="props.data"
                :fields="fields"
                :busy="props.busy"
                outlined
            >
                <template #cell(medicationClasses)="data">
                    <ul>
                        <li
                            v-for="(item,key) in data.item.medicationClasses"
                            :key="key"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </template>
                <template #cell(medications)="data">
                    <ul>
                        <li
                            v-for="(item,key) in data.item.medications"
                            :key="key"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </template>
                <template #cell(supportingVariants)="data">
                    <ul>
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
    </MQueryTherapyResponses>
</template>
