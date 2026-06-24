<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    type Coding,
    type ConceptCountValue,
    DKVChart,
    DKVChartTableSwitch,
    DQuerySummaryGrouped,
    DQuerySummaryNested,
    type KeyValueRecord,
    QueryEventBusEventName,
    injectQueryEventBus,
    toCodingGroup,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import {
    computed,
    defineComponent,
    onUnmounted,
    ref,
} from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryGeneAlteration, QuerySummaryMedication } from '../../../domains';
import { queryGeneAlterationToString } from '../../../domains';

export default defineComponent({
    components: {
        DKVChart,
        DKVChartTableSwitch,
        DQuerySummaryNested,
        DQuerySummaryGrouped,
    },
    props: {
        queryId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const api = injectHTTPClient();
        const queryEventBus = injectQueryEventBus();
        const queryFilterStore = useQueryFilterStore();

        const busy = ref(false);
        const data = ref<null | QuerySummaryMedication>(null);
        const error = ref<Error | null>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            try {
                error.value = null;
                data.value = await api.query.getMedication(props.queryId, queryFilterStore.buildURLRecord());
            } catch (e) {
                error.value = e instanceof Error ? e : new Error('Failed to load medication');
            }
        });

        Promise.resolve()
            .then(() => load());

        const removeSessionHandler = queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        const removeFiltersHandler = queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });
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

        const meanDurationTree = computed(() => {
            if (!data.value) {
                return [];
            }

            // The API provides no class-level duration; classes are only a grouping
            // for the per-drug durations. The numeric value here is a placeholder so
            // DKVTable can resolve the class label, and is never displayed (hidden at
            // class level in the table, flattened past in the chart).
            return data.value.therapies.meanDurations.map((group) => ({
                key: group.key,
                value: 0,
                children: group.value,
            }));
        });

        const flattenMeanDurations = (
            items: KeyValueRecord<Coding | Coding[], number | ConceptCountValue>[],
        ) : KeyValueRecord<Coding | Coding[], number | ConceptCountValue>[] => items.flatMap(
            (item) => (item.children && item.children.length > 0 ?
                item.children :
                [item]),
        );

        const variantLabelFn = (item: { key: unknown }) => {
            if (typeof item.key === 'string') {
                return item.key;
            }

            if (item.key && typeof item.key === 'object') {
                return queryGeneAlterationToString(item.key as QueryGeneAlteration);
            }

            return '???';
        };

        return {
            busy,
            data,
            error,

            recommendedVNode,
            recommendedByVariantVNode,
            variantLabelFn,
            handleRecommendationClick,

            usedVNode,
            handleUsedClick,

            meanDurationTree,
            flattenMeanDurations,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <div>
            <h5>Therapie Empfehlungen</h5>
            <div class="flex flex-col gap-2">
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Empfehlungen nach stützender molekularer Alteration
                    </h6>

                    <template v-if="data.recommendations.distributionBySupportingVariant.length > 0">
                        <DQuerySummaryGrouped
                            ref="recommendedByVariantVNode"
                            :select-first="true"
                            :items="data.recommendations.distributionBySupportingVariant"
                            :label="'Variante'"
                            :placeholder="'Variante auswählen'"
                            :label-fn="variantLabelFn"
                        >
                            <template #default="{ item }">
                                <p class="text-start mb-2">
                                    Gesamtzahl Empfehlungen nach ausgewählter stützender molekularer Alteration: N = {{ item.value.total }}
                                </p>
                                <DKVChartTableSwitch
                                    :type="'bar'"
                                    :data="item.value.elements"
                                    :clickable="true"
                                    :key-label="'Wirkstoff'"
                                    :value-label="'Anzahl Empfehlungen [n]'"
                                    :percent-label="'Anteil Empfehlungen (basierend auf Variante) [%]'"
                                    :x-axis-label="'Anzahl Empfehlungen [n]'"
                                    :y-axis-label="'Wirkstoff'"
                                    @clicked="(keys: Coding[]) => handleRecommendationClick(keys, 'recommendedByVariant')"
                                />
                            </template>
                        </DQuerySummaryGrouped>
                    </template>
                    <template v-else>
                        <div class="alert alert-sm alert-info mb-0">
                            Es sind keine stützenden molekularen Alterationen hinterlegt.
                        </div>
                    </template>
                </div>
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Gesamtverteilung der Empfehlungen nach Wirkstoffklasse (N = {{ data.recommendations.overallDistribution.total }})
                    </h6>

                    <DQuerySummaryNested
                        ref="recommendedVNode"
                        :label="'Kategorie'"
                        :placeholder="'Kategorie auswählen'"
                        :total="data.recommendations.overallDistribution.total"
                        :data="(data.recommendations.overallDistribution.elements as any)"
                    >
                        <template #default="{ items, id }">
                            <DKVChartTableSwitch
                                :data="items"
                                :clickable="true"
                                :x-axis-label="'Anzahl Empfehlungen [n]'"
                                :y-axis-label="'Wirkstoffklasse bzw. Wirkstoff'"
                                :columns="(level: number) => level === 0 && !id ? [
                                    {key: 'key', label: 'Wirkstoffklasse'},
                                    {key: 'value', label: 'Anzahl Empfehlungen [n]'},
                                    {key: 'percent', label: 'Anteil Empfehlungen [%]'},
                                ] : [
                                    {key: 'key', label: 'Wirkstoff'},
                                    {key: 'value', label: 'Anzahl Empfehlungen [n]'},
                                    {key: 'percent', label: 'Anteil bzgl. Wirkstoffklasse [%]'},
                                ]"
                                @clicked="(keys: Coding[]) => handleRecommendationClick(keys, 'recommended')"
                            />
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>

            <hr>

            <h5>Umgesetzte Therapien</h5>
            <div class="flex flex-col gap-2">
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse (N = {{ data.therapies.overallDistribution.total }})
                    </h6>

                    <DQuerySummaryNested
                        ref="usedVNode"
                        :label="'Kategorie'"
                        :placeholder="'Kategorie auswählen'"
                        :data="(data.therapies.overallDistribution.elements as any)"
                        :total="data.therapies.overallDistribution.total"
                    >
                        <template #default="{ items, id }">
                            <DKVChartTableSwitch
                                :data="items"
                                :clickable="true"
                                :x-axis-label="'Anzahl umgesetzter Therapien [n]'"
                                :y-axis-label="'Wirkstoffklasse bzw. Wirkstoff'"
                                :columns="(level: number) => level === 0 && !id ? [
                                    {key: 'key', label: 'Wirkstoffklasse'},
                                    {key: 'value', label: 'Anzahl umgesetzter Therapien [n]'},
                                    {key: 'percent', label: 'Anteil umgesetzter Therapien [%]'},
                                ] : [
                                    {key: 'key', label: 'Wirkstoff'},
                                    {key: 'value', label: 'Anzahl umgesetzter Therapien [n]'},
                                    {key: 'percent', label: 'Anteil bzgl. Wirkstoffklasse [%]'},
                                ]"
                                @clicked="handleUsedClick"
                            />
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Mittlere Therapiedauer
                    </h6>
                    <DQuerySummaryNested
                        :label="'Kategorie'"
                        :placeholder="'Kategorie auswählen'"
                        :data="(meanDurationTree as any)"
                    >
                        <template #default="{ items, id }">
                            <DKVChartTableSwitch
                                :data="items"
                                :coding-verbose-label="true"
                                :clickable="true"
                                :x-axis-label="'Dauer in Wochen [Ø]'"
                                :y-axis-label="'Wirkstoffklasse bzw. Wirkstoff'"
                                :columns="(level: number) => level === 0 && !id ? [
                                    {key: 'key', label: 'Wirkstoffklasse'},
                                ] : [
                                    {key: 'key', label: 'Wirkstoff'},
                                    {key: 'value', label: 'Dauer in Wochen [Ø]'},
                                ]"
                                @clicked="handleUsedClick"
                            >
                                <template #chart>
                                    <DKVChart
                                        :items="flattenMeanDurations(items)"
                                        :coding-verbose-label="true"
                                        :x-axis-label="'Dauer in Wochen [Ø]'"
                                        :y-axis-label="'Wirkstoff'"
                                    />
                                </template>
                            </DKVChartTableSwitch>
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Therapie Empfehlungen</h5>
            <div class="flex flex-col gap-2">
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Empfehlungen nach stützender molekularer Alteration
                    </h6>
                    <VCPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Gesamtverteilung der Empfehlungen nach Wirkstoffklasse
                    </h6>
                    <VCPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
            </div>

            <hr>

            <h5>Umgesetzte Therapien</h5>
            <div class="flex flex-col gap-2">
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse
                    </h6>
                    <VCPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-full">
                    <h6 class="section-label">
                        Mittlere Therapiedauer
                    </h6>
                    <VCPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="error">
        <div class="alert alert-sm alert-danger">
            Daten konnten nicht geladen werden.
        </div>
    </template>
</template>
