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
    DKVChartTableSwitch,
    DKVTableEntryKey,
    DQuerySummaryGrouped,
    DQuerySummaryNested,
    QueryEventBusEventName,
    injectQueryEventBus,
    toCodingGroup,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { BPlaceholder, BTable } from 'bootstrap-vue-next';
import { defineComponent, onUnmounted, ref } from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';
import type { QuerySummaryMedication } from '../../../domains';

export default defineComponent({
    components: {
        BPlaceholder,
        DKVTableEntryKey,
        BTable,
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

        return {
            busy,
            data,
            error,

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
    <template v-if="data">
        <div>
            <h5>Therapie Empfehlungen</h5>
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Empfehlungen nach stützender molekularer Alteration</h6>

                    <DQuerySummaryGrouped
                        ref="recommendedByVariantVNode"
                        :select-first="true"
                        :items="data.recommendations.distributionBySupportingVariant"
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
                    <h6>Gesamtverteilung der Empfehlungen nach Wirkstoffklasse ({{ data.recommendations.overallDistribution.total }})</h6>

                    <DQuerySummaryNested
                        ref="recommendedVNode"
                        :label="'Kategorie'"
                        :total="data.recommendations.overallDistribution.total"
                        :data="data.recommendations.overallDistribution.elements"
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
                    <h6>Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse ({{ data.therapies.overallDistribution.total }})</h6>

                    <DQuerySummaryNested
                        ref="usedVNode"
                        :label="'Kategorie'"
                        :data="data.therapies.overallDistribution.elements"
                        :total="data.therapies.overallDistribution.total"
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
                        :data="data.therapies.meanDurations"
                        :clickable="true"
                        @clicked="handleUsedClick"
                    >
                        <template #table="tableData">
                            <BTable
                                :items="tableData.data"
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
    <template v-else-if="busy">
        <div>
            <h5>Therapie Empfehlungen</h5>
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Empfehlungen nach stützender molekularer Alteration</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung der Empfehlungen nach Wirkstoffklasse</h6>
                    <BPlaceholder
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
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Mittlere Therapiedauer</h6>
                    <BPlaceholder
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
