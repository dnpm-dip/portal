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
    type ResourceCollectionLoadMeta,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import type { PaginationMeta } from '@vuecs/pagination';
import {
    type PropType, computed, defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QueryTherapyResponseInfo } from '../../../../../domains';
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

        const total = ref(0);
        const offset = ref(0);
        const limit = ref(50);

        const resolve = wrapFnWithBusyState(busy, async (meta: ResourceCollectionLoadMeta = {}) => {
            const response = await api.query.getTherapyResponseInfos(props.entity.id, meta);

            total.value = response.size || response.entries.length;
            limit.value = response.limit ?? limit.value;
            offset.value = response.offset ?? offset.value;
            items.value = response.entries;
        });

        const load = (meta: PaginationMeta) => {
            offset.value = meta.offset;
            limit.value = meta.limit;

            return resolve({ limit: limit.value, offset: offset.value });
        };

        Promise.resolve()
            .then(() => resolve({ filters: queryFilterStore.buildURLRecord(), limit: limit.value }));

        queryEventBus.on(
            QueryEventBusEventName.SESSION_UPDATED,
            () => resolve({ filters: queryFilterStore.buildURLRecord(), limit: limit.value }),
        );
        queryEventBus.on(
            QueryEventBusEventName.FILTERS_COMMITED,
            () => resolve({ filters: queryFilterStore.buildURLRecord(), limit: limit.value }),
        );

        return {
            busy,
            items,
            load,
            total,
            offset,
            limit,
        };
    },
});
</script>
<template>
    <VCPagination
        :busy="busy"
        :total="total"
        :limit="limit"
        :offset="offset"
        @load="load"
    />

    <MQuerySummaryTherapyResponseInfos
        :busy="busy"
        :items="items"
    />

    <VCPagination
        :busy="busy"
        :total="total"
        :limit="limit"
        :offset="offset"
        @load="load"
    />
</template>
