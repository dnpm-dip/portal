<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import { BTable } from 'bootstrap-vue-next';
import type { QueryTherapyResponseByVariant } from '../../../domains';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        MTherapyResponseDistributionBar,
        BTable,
    },
    props: {
        items: {
            type: Object as PropType<QueryTherapyResponseByVariant[]>,
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
                key: 'supportingVariant', label: 'Stützende Variante', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'medicationClasses', label: 'Medikationsklasse', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'medications', label: 'Medikation', thClass: 'text-left', tdClass: 'text-left',
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
