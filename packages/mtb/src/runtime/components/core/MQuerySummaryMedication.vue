<script lang="ts">
import {
    DChartBar, DChartDoughnut, DQuerySummaryGrouped, DQuerySummaryNested, type URLQueryRecord,
} from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryMedication } from '../../domains';

export default defineComponent({
    components: {
        DChartBar,
        DChartDoughnut,
        DQuerySummaryNested,
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
        <h5>Therapie Empfehlungen</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung ({{ entity.recommendations.overallDistribution.total }})</h6>

                    <DQuerySummaryNested
                        :label="'Kategorie'"
                        :entity="entity.recommendations.overallDistribution"
                    >
                        <template #default="{ items }">
                            <DChartBar :items="items" />
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Empfehlungen nach stützender molekularer Alteration</h6>

                    <DQuerySummaryGrouped
                        :items="entity.recommendations.distributionBySupportingVariant"
                        :label="'Variante'"
                    >
                        <template #default="{ item }">
                            <DChartDoughnut
                                style="max-height: 450px"
                                :items="item.value.elements"
                            />
                        </template>
                    </DQuerySummaryGrouped>
                </div>
            </div>
        </div>

        <h5>Umgesetzte Therapien</h5>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Gesamtverteilung ({{ entity.therapies.overallDistribution.total }})</h6>

                    <DQuerySummaryNested
                        :label="'Kategorie'"
                        :entity="entity.therapies.overallDistribution"
                    >
                        <template #default="{ items }">
                            <DChartBar :items="items" />
                        </template>
                    </DQuerySummaryNested>
                </div>
            </div>
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Response-Verteilung nach Medikation</h6>

                    <DQuerySummaryGrouped
                        :items="entity.therapies.responseDistributionByTherapy"
                        :label="'Medikation'"
                    >
                        <template #default="{ item }">
                            <DChartDoughnut
                                style="max-height: 450px"
                                :items="item.value.elements"
                            />
                        </template>
                    </DQuerySummaryGrouped>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>Durchschnittliche Dauer <small>(in Wochen)</small></h6>
                    <DChartBar :items="entity.therapies.meanDurations" />
                </div>
            </div>
            <div class="col" />
        </div>
    </div>
</template>
