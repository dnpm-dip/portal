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
    type PropType, defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QuerySummaryTumorDiagnostics } from '../../../../../domains';
import MQuerySummaryTumorDiagnostics from '../../../../../components/core/query-summary/MQuerySummaryTumorDiagnostics.vue';

export default defineComponent({
    components: { MQuerySummaryTumorDiagnostics },
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
        const data = ref<null | QuerySummaryTumorDiagnostics>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            data.value = await api.query.getTumorDiagnostics(props.entity.id, queryFilterStore.buildURLRecord());
        });

        queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

        Promise.resolve()
            .then(() => load());

        return {
            data,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <MQuerySummaryTumorDiagnostics
            :key="entity.lastUpdate"
            :entity="data"
            :query-id="entity.id"
        />
    </template>
</template>
