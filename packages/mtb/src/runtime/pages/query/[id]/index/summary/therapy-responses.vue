<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import { InjectionKey, type URLQueryRecord } from '@dnpm-dip/core';
import {
    type PropType, type Ref, defineComponent, inject, ref, watch,
} from 'vue';
import MQuerySummaryTherapyResponses from '../../../../../components/core/MQuerySummaryTherapyResponses.vue';
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
        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;

        const api = injectHTTPClient();

        const busy = ref(false);
        const items = ref<QueryTherapyResponse[]>([]);
        const load = wrapFnWithBusyState(busy, async () => {
            const response = await api.query.getTherapyResponses(props.entity.id, queryFilters.value);
            items.value = response.entries;
        });

        Promise.resolve()
            .then(() => load());

        watch(queryFilters, () => {
            load();
        }, { deep: true });

        watch(queryUpdatedAt, () => {
            load();
        });

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
