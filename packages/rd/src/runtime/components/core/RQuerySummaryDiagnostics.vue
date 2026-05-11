<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    DKVChart,
    DQuerySummaryGrouped,
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { BPlaceholder } from 'bootstrap-vue-next';
import { defineComponent, onUnmounted, ref } from 'vue';
import { injectHTTPClient } from '../../core';
import type { QuerySummaryDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        BPlaceholder,
        DKVChart,
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
        const data = ref<null | QuerySummaryDiagnostics>(null);
        const error = ref<Error | null>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            try {
                error.value = null;
                data.value = await api.query.getDiagnostics(props.queryId, queryFilterStore.buildURLRecord());
            } catch (e) {
                error.value = e instanceof Error ? e : new Error('Failed to load diagnostics');
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

        return {
            busy,
            data,
            error,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <div>
            <h5>Gesamtverteilung</h5>

            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            Diagnose Kategorien
                        </h6>
                        <DKVChart :items="data.overallDistributions.diagnoses.elements" />
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            HPOTermen
                        </h6>
                        <DKVChart
                            :items="data.overallDistributions.hpoTerms.elements"
                        />
                    </div>
                </div>
            </div>

            <hr>

            <h5>Verteilung nach Varianten</h5>

            <DQuerySummaryGrouped
                :label="'Variante'"
                :items="(data.distributionsByVariant as any)"
            >
                <template #default="{ item }">
                    <div class="row">
                        <div class="col-12 col-xl-6">
                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    Diagnose Kategorien
                                </h6>
                                <DKVChart :items="item.value.diagnoses.elements" />
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    HPO Termen
                                </h6>
                                <DKVChart :items="item.value.hpoTerms.elements" />
                            </div>
                        </div>
                    </div>
                </template>
            </DQuerySummaryGrouped>
        </div>
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Gesamtverteilung</h5>
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            Diagnose Kategorien
                        </h6>
                        <BPlaceholder
                            v-for="i in 5"
                            :key="i"
                            :width="40 + i * 10 + '%'"
                            animation="wave"
                            class="mb-2"
                        />
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            HPOTermen
                        </h6>
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

            <hr>

            <h5>Verteilung nach Varianten</h5>
            <div class="entity-card text-center mb-3 w-100">
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
