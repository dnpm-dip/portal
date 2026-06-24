<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    DKVChartTableSwitch,
    DQuerySummaryGrouped,
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { defineComponent, onUnmounted, ref } from 'vue';
import { injectHTTPClient } from '../../../core/http-client';
import type { QuerySummaryGeneAlterationDistribution } from '../../../domains';

export default defineComponent({
    components: {
        DQuerySummaryGrouped,
        DKVChartTableSwitch,
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
        const data = ref<null | QuerySummaryGeneAlterationDistribution[]>(null);
        const error = ref<Error | null>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            try {
                error.value = null;
                const response = await api.query.getGeneAlterationDistributions(props.queryId, queryFilterStore.buildURLRecord());
                data.value = response.entries;
            } catch (e) {
                error.value = e instanceof Error ? e : new Error('Failed to load gene alteration distributions');
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
            <h5 class="section-label">
                TOP 20 der alterierten Gene (SNV/ CNV/ Fusion)
            </h5>
            <DQuerySummaryGrouped
                :items="data"
                :label="'Alteration'"
                :placeholder="'Alterationsart auswählen'"
            >
                <template #default="{ item }">
                    <p class="text-start mb-2">
                        N (alterierte Gene) = {{ item.value.elements.length }}
                    </p>
                    <DKVChartTableSwitch
                        :type="'bar'"
                        :data="item.value.elements.slice(0, 20)"
                        :key-label="'alteriertes Gen'"
                        :value-label="'Anzahl [n]'"
                        :percent-label="'Anteil [%]'"
                        :x-axis-label="'Anzahl [n]'"
                        :y-axis-label="'alteriertes Gen (Anteil [%])'"
                    />
                </template>
            </DQuerySummaryGrouped>
        </div>
    </template>
    <template v-else-if="busy">
        <div>
            <h5 class="section-label">
                TOP 20 der alterierten Gene (SNV/ CNV/ Fusion)
            </h5>
            <div class="entity-card text-center mb-3">
                <VCPlaceholder
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
        <VCAlert
            color="error"
            variant="soft"
            size="sm"
        >
            Daten konnten nicht geladen werden.
        </VCAlert>
    </template>
</template>
