<script lang="ts">
import {
    DKVChartTableSwitch, DQuerySummaryGrouped, DQuerySummaryNested,
} from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryMedication } from '../../domains';

export default defineComponent({
    components: {
        DKVChartTableSwitch,
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
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Empfehlungen nach stützender molekularer Alteration</h6>

                <DQuerySummaryGrouped
                    :items="entity.recommendations.distributionBySupportingVariant"
                    :label="'Variante'"
                    :select-first="true"
                >
                    <template #default="{ item }">
                        <DKVChartTableSwitch
                            :type="'doughnut'"
                            :data="item.value.elements"
                        />
                    </template>
                </DQuerySummaryGrouped>
            </div>
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung ({{ entity.recommendations.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    :label="'Kategorie'"
                    :entity="entity.recommendations.overallDistribution"
                >
                    <template #default="{ items }">
                        <DKVChartTableSwitch :data="items" />
                    </template>
                </DQuerySummaryNested>
            </div>
        </div>

        <hr>

        <h5>Umgesetzte Therapien</h5>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Gesamtverteilung ({{ entity.therapies.overallDistribution.total }})</h6>

                <DQuerySummaryNested
                    :label="'Kategorie'"
                    :entity="entity.therapies.overallDistribution"
                >
                    <template #default="{ items }">
                        <DKVChartTableSwitch :data="items" />
                    </template>
                </DQuerySummaryNested>
            </div>
        </div>
        <div class="d-flex flex-column gap-2">
            <div class="entity-card text-center mb-3 w-100">
                <h6>Durchschnittliche Dauer <small>(in Wochen)</small></h6>
                <DKVChartTableSwitch :data="entity.therapies.meanDurations" />
            </div>
        </div>
    </div>
</template>
