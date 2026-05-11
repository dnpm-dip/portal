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
import { BPlaceholder } from 'bootstrap-vue-next';
import { defineComponent, onUnmounted, ref } from 'vue';
import { injectHTTPClient } from '../../../core/http-client';
import type { QuerySummaryGeneAlterationDistribution } from '../../../domains';

export default defineComponent({
    components: {
        BPlaceholder,
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
            <h5>Verteilung nach Alteration</h5>
            <DQuerySummaryGrouped
                :select-first="true"
                :items="data"
                :label="'Alteration'"
            >
                <template #default="{ item }">
                    <DKVChartTableSwitch
                        :type="'bar'"
                        :data="item.value.elements"
                    />
                </template>
            </DQuerySummaryGrouped>
        </div>
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Verteilung nach Alteration</h5>
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
