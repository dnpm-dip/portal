<script lang="ts">

import { type PropType, defineComponent, toRef } from 'vue';
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
    setup(props, expose) {
        const data = toRef(props, 'entity');

        const set = (input: QuerySummaryDemographics): void => {
            data.value = input;
        };

        expose({
            set,
        });

        return {
            data,
        };
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
                        :items="data.siteDistribution.elements"
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
                        :items="data.genderDistribution.elements"
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
                        :items="data.ageDistribution.elements"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
