<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { DQuerySummaryDemographics, type QuerySummaryDemographics } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummary } from '../../../../../domains';

export default defineComponent({
    components: { DQuerySummaryDemographics },
    props: {
        entity: {
            type: Object as PropType<QuerySummary>,
            required: true,
        },
    },
});
</script>
<template>
    <DQuerySummaryDemographics :entity="entity.demographics" />
</template>
