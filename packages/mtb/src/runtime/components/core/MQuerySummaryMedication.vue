<script lang="ts">
import { DChartBar, DQuerySummaryGrouped } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryMedication } from '../../domains';

export default defineComponent({
    components: {
        DChartBar,
        DQuerySummaryGrouped,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryMedication>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <h5>Empfehlungen</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung</h6>

                    <DChartBar :items="entity.recommendations.overallDistribution" />
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung nach Variante</h6>

                    <DQuerySummaryGrouped
                        :items="entity.recommendations.distributionbySupportingVariant"
                        :label="'Variante'"
                    >
                        <template #default="{ item }">
                            {{ item }}
                        </template>
                    </DQuerySummaryGrouped>
                </div>
            </div>
        </div>

        <h5>Therapien</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung</h6>

                    <DChartBar :items="entity.therapies.overallDistribution" />
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Verteilung nach Variante</h6>

                    <DQuerySummaryGrouped
                        :items="entity.therapies.responseDistributionByTherapy"
                        :label="'Variante'"
                    >
                        <template #default="{ item }">
                            {{ item }}
                        </template>
                    </DQuerySummaryGrouped>
                </div>
            </div>
        </div>
    </div>
</template>
