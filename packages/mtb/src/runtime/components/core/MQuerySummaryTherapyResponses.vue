<script lang="ts">
import { DChartDoughnut } from '@dnpm-dip/core';
import { type PropType, defineComponent, ref } from 'vue';
import { BTable } from 'bootstrap-vue-next';
import MQueryTherapyResponses from './MQueryTherapyResponses';

export default defineComponent({
    components: {
        DChartDoughnut,
        MQueryTherapyResponses,
        BTable,
    },
    props: {
        queryId: {
            type: String,
            required: true,
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
                key: 'responseDistribution', label: 'Response Verteilung', thClass: 'text-center', tdClass: 'text-center',
            },
        ];

        return {
            fields,
        };
    },
});
</script>
<template>
    <MQueryTherapyResponses :query-id="queryId">
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
                    <DChartDoughnut
                        style="max-height: 150px"
                        :items="data.item.responseDistribution.elements"
                    />
                </template>
            </BTable>
        </template>
    </MQueryTherapyResponses>
</template>
