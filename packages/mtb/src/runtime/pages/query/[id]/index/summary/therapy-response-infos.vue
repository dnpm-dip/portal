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
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QueryTherapyResponse, QueryTherapyResponseInfo } from '../../../../../domains';
import MQuerySummaryTherapyResponseInfos
    from '../../../../../components/core/query-summary/MQuerySummaryTherapyResponseInfos.vue';

export default defineComponent({
    components: { MQuerySummaryTherapyResponseInfos },
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
        const items = ref<QueryTherapyResponseInfo[]>([]);
        const load = wrapFnWithBusyState(busy, async () => {
            const response = await api.query.getTherapyResponseInfos(props.entity.id, queryFilterStore.buildURLRecord());
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
    <MQuerySummaryTherapyResponseInfos
        :busy="busy"
        :items="items"
    />
</template>
