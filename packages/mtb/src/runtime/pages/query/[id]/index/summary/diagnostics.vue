<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import type { QuerySummary } from '../../../../../domains';
import MQuerySummaryTumorDiagnostics from '../../../../../components/core/MQuerySummaryTumorDiagnostics.vue';

export default defineComponent({
    components: { MQuerySummaryTumorDiagnostics },
    props: {
        entity: {
            type: Object as PropType<QuerySummary>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryTumorDiagnostics :entity="entity.diagnostics" />
</template>
