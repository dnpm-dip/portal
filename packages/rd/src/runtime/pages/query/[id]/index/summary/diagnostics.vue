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
import RQuerySummaryDiagnostics from '../../../../../components/core/RQuerySummaryDiagnostics.vue';

export default defineComponent({
    components: { RQuerySummaryDiagnostics },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <RQuerySummaryDiagnostics :query-id="entity.id" />
</template>
