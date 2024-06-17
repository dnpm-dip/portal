<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import type { QuerySummary } from '../../../../../domains';
import MQuerySummaryMedication from '../../../../../components/core/MQuerySummaryMedication.vue';

export default defineComponent({
    components: { MQuerySummaryMedication },
    props: {
        entity: {
            type: Object as PropType<QuerySummary>,
            required: true,
        },
    },
});
</script>
<template>
    <MQuerySummaryMedication :entity="entity.medication" />
</template>
