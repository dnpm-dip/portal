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
    DQuerySummaryGrouped,
    DQuerySummaryNested,
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { BPlaceholder } from 'bootstrap-vue-next';
import { defineComponent, onUnmounted, ref } from 'vue';
import { QueryFilterURLKey } from '../../../constants';
import { injectHTTPClient } from '../../../core/http-client';
import type { QueryGeneAlteration, QuerySummaryTumorDiagnostics } from '../../../domains';
import { queryGeneAlterationToString } from '../../../domains';

export default defineComponent({
    components: {
        BPlaceholder,
        DQuerySummaryNested,
        DKVChartTableSwitch,
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
        const data = ref<null | QuerySummaryTumorDiagnostics>(null);
        const error = ref<Error | null>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            try {
                error.value = null;
                data.value = await api.query.getTumorDiagnostics(props.queryId, queryFilterStore.buildURLRecord());
            } catch (e) {
                error.value = e instanceof Error ? e : new Error('Failed to load tumor diagnostics');
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

        const tumorEntitiesVNode = ref<null | typeof DQuerySummaryNested>(null);

        const handleClick = (keys: Coding[]) => {
            const [coding] = keys;
            if (typeof coding === 'undefined') {
                return;
            }

            let hasChanged : boolean;

            if (queryFilterStore.hasItem(QueryFilterURLKey.DIAGNOSIS_CODE, coding)) {
                hasChanged = false;
                queryFilterStore.setItems(QueryFilterURLKey.DIAGNOSIS_CODE, []);
            } else {
                hasChanged = true;
                queryFilterStore.setItems(QueryFilterURLKey.DIAGNOSIS_CODE, [coding]);
            }

            queryFilterStore.setActive('diagnosis');
            queryFilterStore.commit();

            if (!hasChanged) {
                if (tumorEntitiesVNode.value) {
                    tumorEntitiesVNode.value.reset();
                }
            }
        };

        return {
            busy,
            data,
            error,
            handleClick,
            variantLabelFn: (item: { key: unknown }) => (typeof item.key === 'string' ?
                item.key :
                queryGeneAlterationToString(item.key as QueryGeneAlteration)),
        };
    },
});
</script>
<template>
    <template v-if="data">
        <div>
            <div>
                <h5>Gesamtverteilung</h5>

                <div class="d-flex flex-column gap-2">
                    <div class="entity-card text-center mb-3">
                        <h6>Tumor-Entitäten (ICD-10-GM)</h6>
                        <DQuerySummaryNested
                            ref="tumorEntitiesVNode"
                            :label="'Kategorie'"
                            :data="data.overallDistributions.tumorEntities.elements"
                            :total="data.overallDistributions.tumorEntities.total"
                            :key-verbose="true"
                        >
                            <template #default="{items}">
                                <DKVChartTableSwitch
                                    :coding-verbose-label="true"
                                    :data="items"
                                    :clickable="true"
                                    @clicked="handleClick"
                                />
                            </template>
                        </DQuerySummaryNested>
                    </div>

                    <div class="entity-card text-center mb-3">
                        <h6>Tumor-Morphologie (ICD-O-3-M)</h6>
                        <DQuerySummaryNested
                            :label="'Kategorie'"
                            :data="data.overallDistributions.tumorMorphologies.elements"
                            :total="data.overallDistributions.tumorMorphologies.total"
                            :key-verbose="true"
                        >
                            <template #default="{items}">
                                <DKVChartTableSwitch
                                    :coding-verbose-label="true"
                                    :data="items"
                                />
                            </template>
                        </DQuerySummaryNested>
                    </div>
                </div>
            </div>

            <hr>

            <div>
                <h5>Verteilung nach Variante</h5>
                <DQuerySummaryGrouped
                    :label="'Variante'"
                    :items="(data.distributionsByVariant as any)"
                    :label-fn="variantLabelFn"
                >
                    <template #default="{ item }">
                        <div class="d-flex flex-column gap-2">
                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    Tumor-Entitäten (ICD-10-GM)
                                </h6>
                                <DKVChartTableSwitch
                                    :coding-verbose-label="true"
                                    :data="item.value.tumorEntities.elements"
                                />
                            </div>

                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    Tumor-Morphologie (ICD-O-3-M)
                                </h6>
                                <DKVChartTableSwitch
                                    :coding-verbose-label="true"
                                    :data="item.value.tumorMorphologies.elements"
                                />
                            </div>
                        </div>
                    </template>
                </DQuerySummaryGrouped>
            </div>
        </div>
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Gesamtverteilung</h5>
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3">
                    <h6>Tumor-Entitäten (ICD-10-GM)</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3">
                    <h6>Tumor-Morphologie (ICD-O-3-M)</h6>
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

            <h5>Verteilung nach Variante</h5>
            <div class="entity-card text-center mb-3">
                <BPlaceholder
                    v-for="i in 5"
                    :key="i"
                    :width="40 + i * 10 + '%'"
                    animation="wave"
                    class="mb-2"
                />
            </div>
        </div>
    </template>
    <template v-else-if="error">
        <div class="alert alert-sm alert-danger">
            Daten konnten nicht geladen werden.
        </div>
    </template>
</template>
