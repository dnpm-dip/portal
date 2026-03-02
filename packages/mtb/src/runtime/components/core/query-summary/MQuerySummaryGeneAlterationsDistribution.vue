<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    DKVChartTableSwitch,
    DQuerySummaryGrouped,
} from '@dnpm-dip/core';
import { type PropType, defineComponent, ref } from 'vue';
import type { QuerySummaryGeneAlterationDistribution } from '../../../domains';

export default defineComponent({
    components: {
        DQuerySummaryGrouped,
        DKVChartTableSwitch,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryGeneAlterationDistribution>,
            required: true,
        },
        queryId: {
            type: String,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <div>
            <h5>Verteilung nach Alteration</h5>
            <DQuerySummaryGrouped
                ref="recommendedByVariantVNode"
                :select-first="true"
                :items="entity"
                :label="'Alteration'"
            >
                <template #default="{ item }">
                    <DKVChartTableSwitch
                        :type="'bar'"
                        :data="item.value.elements"
                    />
                </template>
            </DQuerySummaryGrouped>
        </div>
    </div>
</template>
