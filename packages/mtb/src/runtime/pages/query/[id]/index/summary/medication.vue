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
import { BPlaceholder } from 'bootstrap-vue-next';
import {
    type PropType, defineComponent, onUnmounted, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core/http-client';
import type { QuerySession, QuerySummaryMedication } from '../../../../../domains';
import MQuerySummaryMedication from '../../../../../components/core/query-summary/MQuerySummaryMedication.vue';

export default defineComponent({
    components: { BPlaceholder, MQuerySummaryMedication },
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
        <MQuerySummaryMedication
            :entity="data"
            :query-id="entity.id"
        />
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Therapie Empfehlungen</h5>
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Empfehlungen nach stützender molekularer Alteration</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung der Empfehlungen nach Wirkstoffklasse</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
            </div>

            <hr>

            <h5>Umgesetzte Therapien</h5>
            <div class="d-flex flex-column gap-2">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung der umgesetzten Therapien nach Wirkstoffklasse</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Mittlere Therapiedauer</h6>
                    <BPlaceholder
                        v-for="i in 5"
                        :key="i"
                        :width="40 + i * 10 + '%'"
                        animation="wave"
                        class="mb-2"
                    />
                </div>
            </div>
        </div>
    </template>
</template>
