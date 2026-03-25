<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {
    type PropType, defineComponent,
} from 'vue';
import type { QuerySession } from '../../../../../domains';
import MQuerySummaryMedication from '../../../../../components/core/query-summary/MQuerySummaryMedication.vue';

export default defineComponent({
    components: { MQuerySummaryMedication },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryMedication :query-id="entity.id" />
</template>
