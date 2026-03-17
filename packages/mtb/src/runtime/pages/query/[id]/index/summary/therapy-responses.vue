<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {
    type PropType, defineComponent,
} from 'vue';
import type { QuerySession } from '../../../../../domains';
import MQuerySummaryTherapyResponses
    from '../../../../../components/core/query-summary/MQuerySummaryTherapyResponses.vue';

export default defineComponent({
    components: { MQuerySummaryTherapyResponseInfos: MQuerySummaryTherapyResponses },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryTherapyResponseInfos :query-id="entity.id" />
</template>
