<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { wrapFnWithBusyState } from '@authup/client-web-kit';
import {
    QueryEventBusEventName,
    injectQueryEventBus,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { BPlaceholder } from 'bootstrap-vue-next';
import {
    type PropType, type Ref, defineComponent, onUnmounted, ref,
} from 'vue';
import { injectHTTPClient } from '../../../../../core';
import type { QuerySession, QuerySummaryDiagnostics } from '../../../../../domains';
import RQuerySummaryDiagnostics from '../../../../../components/core/RQuerySummaryDiagnostics.vue';

export default defineComponent({
    components: { BPlaceholder, RQuerySummaryDiagnostics },
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
        const data = ref<null | QuerySummaryDiagnostics>(null);
        const load = wrapFnWithBusyState(busy, async () => {
            data.value = await api.query.getDiagnostics(props.entity.id, queryFilterStore.buildURLRecord());
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
        <RQuerySummaryDiagnostics :entity="data" />
    </template>
    <template v-else-if="busy">
        <div>
            <h5>Gesamtverteilung</h5>
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            Diagnose Kategorien
                        </h6>
                        <BPlaceholder
                            v-for="i in 5"
                            :key="i"
                            :width="40 + i * 10 + '%'"
                            animation="wave"
                            class="mb-2"
                        />
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3 w-100">
                        <h6 class="text-center">
                            HPOTermen
                        </h6>
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

            <hr>

            <h5>Verteilung nach Varianten</h5>
            <div class="entity-card text-center mb-3 w-100">
                <BPlaceholder
                    v-for="i in 5"
                    :key="i"
                    :width="40 + i * 10 + '%'"
                    animation="wave"
                    class="mb-2"
                />
            </div>
        </div>
    </template>
</template>
