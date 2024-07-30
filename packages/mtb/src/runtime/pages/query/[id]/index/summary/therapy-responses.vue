<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { InjectionKey, type URLQueryRecord } from '@dnpm-dip/core';
import {
    type PropType, type Ref, defineComponent, inject,
} from 'vue';
import MQuerySummaryTherapyResponses from '../../../../../components/core/MQuerySummaryTherapyResponses.vue';
import type { QuerySession } from '../../../../../domains';

export default defineComponent({
    components: { MQuerySummaryTherapyResponses },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup() {
        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;

        return {
            queryFilters,
            queryUpdatedAt,
        };
    },
});
</script>
<template>
    <MQuerySummaryTherapyResponses
        :query-id="entity.id"
        :query-updated-at="queryUpdatedAt"
        :query-filters="queryFilters"
    />
</template>
