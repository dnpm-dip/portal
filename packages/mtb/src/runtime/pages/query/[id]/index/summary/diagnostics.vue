<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { InjectionKey, type URLQueryRecord } from '@dnpm-dip/core';
import {
    type PropType, type Ref, defineComponent, inject, ref, watch,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QuerySummary, QuerySummaryTumorDiagnostics } from '../../../../../domains';
import MQuerySummaryTumorDiagnostics from '../../../../../components/core/MQuerySummaryTumorDiagnostics.vue';

export default defineComponent({
    components: { MQuerySummaryTumorDiagnostics },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    async setup(props) {
        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;

        const api = injectHTTPClient();

        const data = ref<null | QuerySummaryTumorDiagnostics>(null);
        const load = async () => {
            data.value = await api.query.getTumorDiagnostics(props.entity.id, queryFilters.value);
        };

        await load();

        watch(queryFilters, () => {
            load();
        }, { deep: true });

        watch(queryUpdatedAt, () => {
            load();
        });

        return {
            data,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <MQuerySummaryTumorDiagnostics :entity="data" />
    </template>
</template>
