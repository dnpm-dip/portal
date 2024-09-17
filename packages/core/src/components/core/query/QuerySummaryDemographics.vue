<script lang="ts">
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryDemographics } from '../../../domains';
import { DKVChartTableSwitch } from '../../utility';

export default defineComponent({
    components: { DKVChartTableSwitch },
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
                    <DKVChartTableSwitch
                        :type="'doughnut'"
                        :data="entity.siteDistribution.elements"
                    />
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>
                        Geschlechterverteilung
                    </h6>
                    <DKVChartTableSwitch
                        :type="'doughnut'"
                        :data="entity.genderDistribution.elements"
                    />
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="entity-card text-center mb-3 w-100">
                    <h6>
                        Altersverteilung
                    </h6>
                    <DKVChartTableSwitch :data="entity.ageDistribution.elements" />
                </div>
            </div>
        </div>
    </div>
</template>
