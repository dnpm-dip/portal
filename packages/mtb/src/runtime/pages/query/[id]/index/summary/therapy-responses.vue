<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import {
    type PropType,
    defineComponent,
} from 'vue';
import { VCIcon } from '@vuecs/icon';
import type { QuerySession } from '../../../../../domains';
import MQuerySummaryCoarseTherapyResponses
    from '../../../../../components/core/query-summary/MQuerySummaryCoarseTherapyResponses.vue';
import MQuerySummaryTherapyResponses
    from '../../../../../components/core/query-summary/MQuerySummaryTherapyResponses.vue';

export default defineComponent({
    components: {
        VCIcon,
        MQuerySummaryCoarseTherapyResponseInfos: MQuerySummaryCoarseTherapyResponses,
        MQuerySummaryTherapyResponseInfos: MQuerySummaryTherapyResponses,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <div class="flex flex-col gap-6">
        <div>
            <h6 class="section-label">
                <VCIcon name="fa6-solid:layer-group" /> Nach Entität &amp; Medikation
            </h6>
            <MQuerySummaryCoarseTherapyResponseInfos :query-id="entity.id" />
        </div>
        <div>
            <h6 class="section-label">
                <VCIcon name="fa6-solid:dna" /> Nach stützender Variante
            </h6>
            <MQuerySummaryTherapyResponseInfos :query-id="entity.id" />
        </div>
    </div>
</template>
