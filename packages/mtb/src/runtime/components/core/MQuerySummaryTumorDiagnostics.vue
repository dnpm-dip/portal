<script lang="ts">
import { DChartBar, DQuerySummaryGrouped } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryTumorDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        DChartBar,
        DQuerySummaryGrouped,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryTumorDiagnostics>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Tumor-Entitäten (ICD-10-GM)</h6>

                    <DChartBar :items="entity.tumorEntityDistribution" />
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Tumor-Morphologie (IDC-0-3-M)</h6>

                    <DChartBar :items="entity.tumorMorphologyDistribution" />
                </div>
            </div>
        </div>
        <div>
            <div class="entity-card mb-3 w-100">
                <h6>Tumor-Entitäten (ICD-10-GM) pro Variante</h6>
                <DQuerySummaryGrouped
                    :items="entity.tumorEntityDistributionByVariant"
                    :label="'Variante'"
                >
                    <template #default="{ item }">
                        {{ item }}
                    </template>
                </DQuerySummaryGrouped>
            </div>
        </div>
    </div>
</template>
