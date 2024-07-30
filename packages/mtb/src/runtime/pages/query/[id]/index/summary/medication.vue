<!--
  - Copyright (c) 2024-2024.
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
import type { QuerySession, QuerySummaryMedication } from '../../../../../domains';
import MQuerySummaryMedication from '../../../../../components/core/MQuerySummaryMedication.vue';

export default defineComponent({
    components: { MQuerySummaryMedication },
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

        const data = ref<null | QuerySummaryMedication>(null);
        const load = async () => {
            data.value = await api.query.getMedication(props.entity.id, queryFilters.value);
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
        <MQuerySummaryMedication
            :entity="data"
        />
    </template>
</template>
