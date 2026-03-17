<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import {
    type PropType, defineComponent, onUnmounted, ref,
} from 'vue';
import MQuerySummaryGeneAlterationsDistribution
    from '../../../../../components/core/query-summary/MQuerySummaryGeneAlterationsDistribution.vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type {
    QuerySession,
    QuerySummaryGeneAlterationDistribution,
    QuerySummaryTumorDiagnostics,
} from '../../../../../domains';
import MQuerySummaryTumorDiagnostics from '../../../../../components/core/query-summary/MQuerySummaryTumorDiagnostics.vue';

export default defineComponent({
    components: { MQuerySummaryGeneAlterationsDistribution, MQuerySummaryTumorDiagnostics },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup(props) {
        const api = injectHTTPClient();
        const queryEventBus = injectQueryEventBus();
        const queryFilterStore = useQueryFilterStore();

        const busy = ref(false);
        const tumorDiagnostics = ref<null | QuerySummaryTumorDiagnostics>(null);
        const distributions = ref<null | QuerySummaryGeneAlterationDistribution>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            tumorDiagnostics.value = await api.query.getTumorDiagnostics(props.entity.id, queryFilterStore.buildURLRecord());
            const response = await api.query.getGeneAlterationDistributions(props.entity.id, queryFilterStore.buildURLRecord());

            distributions.value = response.entries;
        });

        const removeSessionHandler = queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        const removeFiltersHandler = queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });

        Promise.resolve()
            .then(() => load());

        return {
            tumorDiagnostics,
            distributions,
        };
    },
});
</script>
<template>
    <template v-if="tumorDiagnostics">
        <MQuerySummaryTumorDiagnostics
            :key="entity.lastUpdate"
            :entity="tumorDiagnostics"
            :query-id="entity.id"
        />
    </template>
    <template v-if="distributions">
        <hr>
        <MQuerySummaryGeneAlterationsDistribution
            :query-id="entity.id"
            :entity="distributions"
        />
    </template>
</template>
