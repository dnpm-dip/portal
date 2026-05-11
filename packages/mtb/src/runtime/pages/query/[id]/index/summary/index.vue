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
import type { QuerySession } from '../../../../../domains';
import MQuerySummaryDemographics
    from '../../../../../components/core/query-summary/MQuerySummaryDemographics.vue';

export default defineComponent({
    components: { MQuerySummaryDemographics },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryDemographics :query-id="entity.id" />
</template>
