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
    <div class="d-flex flex-column">
        <div>
            <h5>Gesamtverteilung</h5>
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3">
                        <h6>Tumor-Entitäten (ICD-10-GM)</h6>
                        <DChartBar :items="entity.overallDistributions.tumorEntities.elements" />
                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="entity-card text-center mb-3">
                        <h6>Tumor-Morphologie (ICD-O-3-M)</h6>
                        <DChartBar :items="entity.overallDistributions.tumorMorphologies.elements" />
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h5>Verteilung nach Variante</h5>
            <DQuerySummaryGrouped
                :label="'Variante'"
                :items="entity.distributionsByVariant"
            >
                <template #default="{ item }">
                    <div class="row">
                        <div class="col-12 col-xl-6">
                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    Tumor-Entitäten (ICD-10-GM)
                                </h6>
                                <DChartBar :items="item.value.tumorEntities.elements" />
                            </div>
                        </div>
                        <div class="col-12 col-xl-6">
                            <div class="entity-card text-center mb-3 w-100">
                                <h6 class="text-center">
                                    Tumor-Morphologie (IDC-O-3-M)
                                </h6>
                                <DChartBar :items="item.value.tumorMorphologies.elements" />
                            </div>
                        </div>
                    </div>
                </template>
            </DQuerySummaryGrouped>
        </div>
    </div>
</template>
