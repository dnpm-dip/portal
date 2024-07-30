<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {
    DQuerySummaryDemographics,
    InjectionKey,
    type URLQueryRecord,
} from '@dnpm-dip/core';
import {
    type PropType, type Ref, defineComponent, inject,
} from 'vue';
import MQueryDemographics from '../../../../../components/core/MQueryDemographics';
import type { QuerySession } from '../../../../../domains';

export default defineComponent({
    components: { MQueryDemographics, DQuerySummaryDemographics },
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
    <MQueryDemographics
        :query-id="entity.id"
        :query-record="queryFilters"
        :query-updated-at="queryUpdatedAt"
    >
        <template #default="{ data }">
            <DQuerySummaryDemographics :entity="data" />
        </template>
    </MQueryDemographics>
</template>
