<script lang="ts">

import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryDemographics } from '../../../domains';
import { DChartBar, DChartDoughnut } from '../../utility';

export default defineComponent({
    components: { DChartDoughnut, DChartBar },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryDemographics>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <h5>Allgemein</h5>
        <div class="row">
            <div class="col-12 col-xl-4">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>
                        Patienten pro Standort
                    </h6>
                    <DChartDoughnut
                        style="max-height: 390px"
                        :items="entity.siteDistribution.elements"
                    />
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>
                        Geschlechterverteilung
                    </h6>
                    <DChartDoughnut
                        style="max-height: 390px"
                        :items="entity.genderDistribution.elements"
                    />
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>
                        Altersverteilung
                    </h6>
                    <DChartBar
                        style="max-height: 390px"
                        :items="entity.ageDistribution.elements"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
