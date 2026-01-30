<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type Coding,
    DKVChartTableSwitch,
    DKVTableEntryKey,
    DQuerySummaryGrouped,
    DQuerySummaryNested,
    toCodingGroup,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import DKVTableEntry from "@dnpm-dip/core/components/utility/kv-table/DKVTableEntry.vue";
import {BTable} from "bootstrap-vue-next";
import { type PropType, defineComponent, ref } from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import type { QuerySummaryMedication } from '../../../domains';

export default defineComponent({
    components: {
        DKVTableEntryKey,
        DKVTableEntry,
        BTable,
        DKVChartTableSwitch,
        DQuerySummaryNested,
        DQuerySummaryGrouped,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryMedication>,
            required: true,
        },
        queryId: {
            type: String,
            required: true,
        },
    },
    setup() {
        const queryFilterStore = useQueryFilterStore();
        const recommendedVNode = ref<null | typeof DQuerySummaryNested>(null);
        const recommendedByVariantVNode = ref<null | typeof DQuerySummaryGrouped>(null);
        const usedVNode = ref<null | typeof DQuerySummaryNested>(null);

        const handleRecommendationClick = (
            keys: Coding[],
            type: 'recommended' | 'recommendedByVariant',
        ) => {
            const group = toCodingGroup(keys);

            let hasChanged : boolean;

            if (queryFilterStore.hasItem(QueryFilterURLKey.THERAPY_RECOMMENDED, group)) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_RECOMMENDED, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_RECOMMENDED, [group]);
            }

            queryFilterStore.setActive('recommended');
            queryFilterStore.commit();

            if (!hasChanged) {
                if (
                    type === 'recommended' &&
                    recommendedVNode.value
                ) {
                    recommendedVNode.value.reset();
                }

                if (
                    type === 'recommendedByVariant' &&
                    recommendedByVariantVNode.value
                ) {
                    recommendedByVariantVNode.value.reset();
                }
            }
        };

        const handleUsedClick = (keys: Coding[]) => {
            const group = toCodingGroup(keys);

            let hasChanged : boolean;

            if (queryFilterStore.hasItem(QueryFilterURLKey.THERAPY_IMPLEMENTED, group)) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_IMPLEMENTED, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.THERAPY_IMPLEMENTED, [group]);
            }

            queryFilterStore.setActive('used');
            queryFilterStore.commit();

            if (!hasChanged) {
                if (usedVNode.value) {
                    usedVNode.value.reset();
                }
            }
        };

        return {
            recommendedVNode,
            recommendedByVariantVNode,
            handleRecommendationClick,

            usedVNode,
            handleUsedClick,
        };
    },
});
</script>
<template>
    <div>
        <h5>Therapie Empfehlungen</h5>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Empfehlungen nach stützender molekularer Alteration</h6>

                <DQuerySummaryGrouped
                    ref="recommendedByVariantVNode"
                    :select-first="true"
                    :items="entity.recommendations.distributionBySupportingVariant"
                    :label="'Variante'"
                >
                    <template #default="{ item }">
                        <DKVChartTableSwitch
                            :type="'bar'"
                            :data="item.value.elements"
                            :clickable="true"
                            @clicked="(keys) => handleRecommendationClick(keys, 'recommendedByVariant')"
                        />
                    </template>
                </DQuerySummaryGrouped>
            </div>
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung der Empfehlungen nach Wirkstoffklasse ({{ entity.recommendations.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    ref="recommendedVNode"
                    :label="'Kategorie'"
                    :total="entity.recommendations.overallDistribution.total"
                    :data="entity.recommendations.overallDistribution.elements"
                >
                    <template #default="{ items }">
                        <DKVChartTableSwitch
                            :data="items"
                            :clickable="true"
                            @clicked="(keys) => handleRecommendationClick(keys, 'recommended')"
                        />
                    </template>
                </DQuerySummaryNested>
            </div>
        </div>

        <hr>

        <h5>Umgesetzte Therapien</h5>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse ({{ entity.therapies.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    ref="usedVNode"
                    :label="'Kategorie'"
                    :data="entity.therapies.overallDistribution.elements"
                    :total="entity.therapies.overallDistribution.total"
                >
                    <template #default="{ items }">
                        <DKVChartTableSwitch
                            :data="items"
                            :clickable="true"
                            @clicked="handleUsedClick"
                        />
                    </template>
                </DQuerySummaryNested>
            </div>
        </div>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Mittlere Therapiedauer</h6>
                <DKVChartTableSwitch
                    :data="entity.therapies.meanDurations"
                    :clickable="true"
                    @clicked="handleUsedClick"
                >
                    <template #table="data">
                        <BTable
                            :items="data.data"
                            :fields="[
                                {
                                    key: 'key',
                                    label: 'Element',
                                    thClass: 'text-left',
                                    tdClass: 'text-left',
                                },
                                {
                                    key: 'value',
                                    label: 'Dauer in Wochen',
                                    thClass: 'text-center',
                                    tdClass: 'text-center',
                                }
                            ]"
                            outlined
                        >
                            <template #cell(key)="cell">
                                <DKVTableEntryKey :entity="cell.item" />
                            </template>
                            <template #cell(value)="cell">
                                {{ Number(cell.item.value).toFixed(2) }}
                            </template>
                        </BTable>
                    </template>
                </DKVChartTableSwitch>
            </div>
        </div>
    </div>
</template>
