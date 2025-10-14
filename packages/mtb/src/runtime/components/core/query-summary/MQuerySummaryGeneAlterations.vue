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
import type { QueryGeneAlterationInfo } from '../../../domains';
import MTherapyResponseDistributionBar from '../MTherapyResponseDistributionBar.vue';

export default defineComponent({
    components: {
        DCodingText,
        MTherapyResponseDistributionBar,
        BTable,
    },
    props: {
        items: {
            type: Object as PropType<QueryGeneAlterationInfo[]>,
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
                key: 'gene', label: 'Gen', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'alteration', label: 'Variante', thClass: 'text-left', tdClass: 'text-left',
            },
            {
                key: 'count', label: 'Anzahl', thClass: 'text-center', tdClass: 'text-center align-middle',
            },
            {
                key: 'supporting', label: 'Stützend?', thClass: 'text-center', tdClass: 'text-center align-middle',
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
        <template #cell(gene)="data">
            <DCodingText :entity="data.item.gene" />
        </template>
        <template #cell(responseDistribution)="data">
            <MTherapyResponseDistributionBar :distribution="data.item.responseDistribution" />
        </template>

        <template #cell(supporting)="data">
            <i
                class="fa"
                :class="{
                    'fa-check text-success': data.item.supporting,
                    'fa-times text-danger': !data.item.supporting
                }"
            />
        </template>
    </BTable>
</template>
<style scoped>
.column {
    word-break: break-all;
}
</style>
