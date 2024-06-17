<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { DChartLineKM, type KMSurvivalReport } from '@dnpm-dip/core';
import {
    defineComponent, ref, toRef, watch,
} from 'vue';
import { injectHTTPClient } from '../../core/http-client';

export default defineComponent({
    components: { DChartLineKM },
    props: {
        queryId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        grouping: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const httpClient = injectHTTPClient();

        const type = toRef(props, 'type');
        const grouping = toRef(props, 'grouping');

        const busy = ref(false);
        const data = ref<KMSurvivalReport | null>(null);

        const resolve = async () => {
            if (busy.value) return;

            busy.value = true;

            try {
                data.value = await httpClient.query.getKaplanMeierStatistics(props.queryId, type.value, grouping.value);
            } finally {
                busy.value = false;
            }
        };

        Promise.resolve()
            .then(resolve);

        watch(type, (val, oldValue) => {
            if (val !== oldValue) {
                resolve();
            }
        });

        watch(grouping, (val, oldValue) => {
            if (val !== oldValue) {
                resolve();
            }
        });

        return {
            data,
            busy,
        };
    },
});
</script>
<template>
    <div class="entity-card text-center mb-3 w-100">
        <template v-if="busy || !data" />
        <template v-else>
            <h6>{{ data.survivalType.display }} (Gruppierung: {{ data.grouping.display }})</h6>
            <DChartLineKM :report="data" />
        </template>
    </div>
</template>
