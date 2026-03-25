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
import { BPlaceholder } from 'bootstrap-vue-next';
import { defineComponent, onUnmounted, ref } from 'vue';
import { injectHTTPClient } from '../../core';

export default defineComponent({
    components: { BPlaceholder, DQuerySummaryDemographics },
    props: {
        queryId: {
            type: String,
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
            data.value = await api.query.getDemographics(props.queryId, queryFilterStore.buildURLRecord());
        });

        Promise.resolve()
            .then(() => load());

        const removeSessionHandler = queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => load());
        const removeFiltersHandler = queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => load());

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
        });

        return {
            busy,
            data,
        };
    },
});
</script>
<template>
    <template v-if="data">
        <DQuerySummaryDemographics :entity="data" />
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Allgemein</h5>
            <div class="d-flex flex-row gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Patienten pro Standort</h6>
                    <BPlaceholder
                        v-for="i in 4"
                        :key="i"
                        :width="50 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Geschlechterverteilung</h6>
                    <BPlaceholder
                        v-for="i in 4"
                        :key="i"
                        :width="50 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
            </div>
            <div class="entity-card text-center mb-3 w-100">
                <h6>Altersverteilung</h6>
                <BPlaceholder
                    v-for="i in 4"
                    :key="i"
                    :width="40 + i * 15 + '%'"
                    animation="wave"
                    class="mb-2"
                />
            </div>
        </div>
    </template>
</template>
