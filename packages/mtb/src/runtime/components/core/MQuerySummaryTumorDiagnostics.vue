<script lang="ts">
import { DChartBar, DChartDoughnut, DQuerySummaryGrouped } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryTumorDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        DChartDoughnut,
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
        <h5>Tumor-Entitäten (ICD-10-GM)</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung</h6>
                    <DChartBar :items="entity.tumorEntityDistribution" />
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung nach Variante</h6>
                    <DQuerySummaryGrouped
                        :items="entity.tumorEntityDistributionByVariant"
                        :label="'Variante'"
                    >
                        <template #default="{ item }">
                            <DChartDoughnut
                                style="max-height: 450px"
                                :items="item.value"
                            />
                        </template>
                    </DQuerySummaryGrouped>
                </div>
            </div>
        </div>
        <h5>Tumor-Morphologie (IDC-0-3-M)</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung</h6>
                    <DChartBar :items="entity.tumorMorphologyDistribution" />
                </div>
            </div>
        </div>
    </div>
</template>
