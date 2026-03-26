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
import MQuerySummaryGeneAlterationsDistribution
    from '../../../../../components/core/query-summary/MQuerySummaryGeneAlterationsDistribution.vue';
import type { QuerySession } from '../../../../../domains';
import MQuerySummaryTumorDiagnostics from '../../../../../components/core/query-summary/MQuerySummaryTumorDiagnostics.vue';

export default defineComponent({
    components: { MQuerySummaryGeneAlterationsDistribution, MQuerySummaryTumorDiagnostics },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryTumorDiagnostics :query-id="entity.id" />
    <hr>
    <MQuerySummaryGeneAlterationsDistribution :query-id="entity.id" />
</template>
