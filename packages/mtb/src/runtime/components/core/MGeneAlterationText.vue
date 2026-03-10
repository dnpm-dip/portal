<!--
  - Copyright (c) 2026.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import DCodingText from '@dnpm-dip/core/components/core/coding/DCodingText';
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { QueryGeneAlteration } from '../../domains/index';

export default defineComponent({
    components: { DCodingText },
    props: {
        entity: {
            type: Object as PropType<QueryGeneAlteration>,
            required: true,
        },
    },
});
</script>
<template>
    <template v-if="entity.type === 'SNV'">
        <DCodingText :entity="entity.gene" /> {{ entity.proteinChange || 'SNV ' }}
    </template>
    <template v-else-if="entity.type === 'CNV'">
        <DCodingText :entity="entity.gene" /> <DCodingText :entity="entity.copyNumberType" />
    </template>
    <template v-else-if="entity.type === 'Fusion'">
        <DCodingText :entity="entity.gene" />-<DCodingText :entity="entity.partner" /> Fusion
    </template>
    <template v-else>
        ???
    </template>
</template>
