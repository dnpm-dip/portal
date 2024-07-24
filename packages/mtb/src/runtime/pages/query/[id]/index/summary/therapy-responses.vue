<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import MQuerySummaryTherapyResponses from '../../../../../components/core/MQuerySummaryTherapyResponses.vue';
import type { QuerySummary } from '../../../../../domains';

export default defineComponent({
    components: { MQuerySummaryTherapyResponses },
    props: {
        entity: {
            type: Object as PropType<QuerySummary>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryTherapyResponses :query-id="entity.id" />
</template>
