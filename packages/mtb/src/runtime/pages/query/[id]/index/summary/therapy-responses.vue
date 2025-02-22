<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import { QueryEventBusEventName, injectQueryEventBus, useQueryFilterStore } from '@dnpm-dip/core';
import {
    type PropType, defineComponent, ref,
} from 'vue';
import MQuerySummaryTherapyResponses from '../../../../../components/core/query-summary/MQuerySummaryTherapyResponses.vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QueryTherapyResponse } from '../../../../../domains';

export default defineComponent({
    components: { MQuerySummaryTherapyResponses },
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
        const items = ref<QueryTherapyResponse[]>([]);
        const load = wrapFnWithBusyState(busy, async () => {
            const response = await api.query.getTherapyResponses(props.entity.id, queryFilterStore.buildURLRecord());
            items.value = response.entries;
        });

        Promise.resolve()
            .then(() => load());

        queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

        return {
            busy,
            items,
        };
    },
});
</script>
<template>
    <MQuerySummaryTherapyResponses
        :busy="busy"
        :items="items"
    />
</template>
