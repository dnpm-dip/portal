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
    QueryEventBusEventName,
    type QuerySummaryDemographics,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import {
    type PropType, defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
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
        const api = injectHTTPClient();
        const queryEventBus = injectQueryEventBus();
        const queryFilterStore = useQueryFilterStore();

        const busy = ref(false);
        const data = ref<null | QuerySummaryDemographics>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            data.value = await api.query.getDemographics(props.entity.id, queryFilterStore.buildURLRecord());
        });

        Promise.resolve()
            .then(() => load());

        queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

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
