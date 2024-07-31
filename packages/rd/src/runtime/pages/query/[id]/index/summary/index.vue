<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    DQuerySummaryDemographics,
    InjectionKey, type QuerySummaryDemographics,
    type URLQueryRecord,
} from '@dnpm-dip/core';
import {
    type PropType, type Ref, defineComponent, inject, ref, watch,
} from 'vue';
import { injectHTTPClient } from '../../../../../core';
import type { QuerySession } from '../../../../../domains';

export default defineComponent({
    components: { DQuerySummaryDemographics },
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
        const data = ref<null | QuerySummaryDemographics>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            data.value = await api.query.getDemographics(props.entity.id, queryFilters.value);
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
            data,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <DQuerySummaryDemographics
            :entity="data"
        />
    </template>
</template>
