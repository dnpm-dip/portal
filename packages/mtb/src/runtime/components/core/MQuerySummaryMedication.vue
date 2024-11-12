<script lang="ts">
import {
    type Coding,
    DKVChartTableSwitch, DQuerySummaryGrouped, DQuerySummaryNested, toCodingGroup, useQueryFilterStore,
} from '@dnpm-dip/core';
import { type PropType, defineComponent, ref } from 'vue';
import { navigateTo } from '#imports';
import { QueryFilterURLKey } from '../../constants';
import type { QuerySummaryMedication } from '../../domains';

export default defineComponent({
    components: {
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
    setup(props) {
        const queryFilterStore = useQueryFilterStore();
        const recommendedVNode = ref<null | typeof DQuerySummaryNested>(null);
        const usedVNode = ref<null | typeof DQuerySummaryNested>(null);

        const handleRecommendationClick = (keys: Coding[]) => {
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

            if (hasChanged) {
                navigateTo(`/mtb/query/${props.queryId}/patients`);
            } else if (recommendedVNode.value) {
                recommendedVNode.value.reset();
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

            if (hasChanged) {
                navigateTo(`/mtb/query/${props.queryId}/patients`);
            } else if (usedVNode.value) {
                usedVNode.value.reset();
            }
        };

        return {
            recommendedVNode,
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
                    :items="entity.recommendations.distributionBySupportingVariant"
                    :label="'Variante'"
                    :select-first="true"
                >
                    <template #default="{ item }">
                        <DKVChartTableSwitch
                            :type="'bar'"
                            :data="item.value.elements"
                        />
                    </template>
                </DQuerySummaryGrouped>
            </div>
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung ({{ entity.recommendations.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    ref="recommendedVNode"
                    :label="'Kategorie'"
                    :entity="entity.recommendations.overallDistribution"
                >
                    <template #default="{ items }">
                        <DKVChartTableSwitch
                            :data="items"
                            :clickable="true"
                            @clicked="handleRecommendationClick"
                        />
                    </template>
                </DQuerySummaryNested>
            </div>
        </div>

        <hr>

        <h5>Umgesetzte Therapien</h5>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung ({{ entity.therapies.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    ref="usedVNode"
                    :label="'Kategorie'"
                    :entity="entity.therapies.overallDistribution"
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
                <h6>Durchschnittliche Dauer <small>(in Wochen)</small></h6>
                <DKVChartTableSwitch :data="entity.therapies.meanDurations" />
            </div>
        </div>
    </div>
</template>
