<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    injectQueryEventBus, useQueryFilterStore,
} from '@dnpm-dip/core';
import { QueryEventBusEventName } from '@dnpm-dip/core/services/query-event-bus/constants';
import {
    type PropType, defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QuerySummaryMedication } from '../../../../../domains';
import MQuerySummaryMedication from '../../../../../components/core/query-summary/MQuerySummaryMedication.vue';

export default defineComponent({
    components: { MQuerySummaryMedication },
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
        const data = ref<null | QuerySummaryMedication>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            data.value = await api.query.getMedication(props.entity.id, queryFilterStore.buildURLRecord());
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
        <MQuerySummaryMedication
            :entity="data"
            :query-id="entity.id"
        />
    </template>
</template>
