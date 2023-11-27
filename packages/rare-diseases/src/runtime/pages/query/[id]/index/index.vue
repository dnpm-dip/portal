<script lang="ts">
import type { LegendItem } from 'chart.js';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#imports';
import QuerySummaryEntity from '../../../../components/core/QuerySummaryEntity';
import QuerySummaryDistributionBar from '../../../../components/core/QuerySummaryDistributionBar.vue';
import QuerySummaryDistributionDoughnut from '../../../../components/core/QuerySummaryDistributionDoughnut.vue';
import type { RDQuerySession } from '../../../../domains';

export default defineNuxtComponent({
    components: { QuerySummaryDistributionBar, QuerySummaryDistributionDoughnut, QuerySummaryEntity },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup() {
        const handleLabelClicked = (label: LegendItem) => {
            console.log(label);
        };

        return {
            handleLabelClicked,
        };
    },
});
</script>
<template>
    <QuerySummaryEntity :query-id="entity.id">
        <template #default="props">
            <div>
                <h5>Allgemein</h5>
                <div class="row">
                    <div class="col-12 col-xl-4">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6>
                                Patienten pro Standort
                            </h6>
                            <QuerySummaryDistributionDoughnut
                                style="max-height: 390px"
                                :items="props.data.siteDistribution"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-xl-4">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6>
                                Verteilung von Geschlechtern
                            </h6>
                            <QuerySummaryDistributionDoughnut
                                style="max-height: 390px"
                                :items="props.data.genderDistribution"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-xl-4">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6>
                                Verteilung des Alters
                            </h6>
                            <QuerySummaryDistributionBar
                                style="max-height: 390px"
                                :items="props.data.ageDistribution"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="row">
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von HPOTermen
                            </h6>
                            <QuerySummaryDistributionBar
                                :items="props.data.hpoTermDistribution"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von Diagnose Kategorien
                            </h6>
                            <QuerySummaryDistributionBar :items="props.data.diagnosisCategoryDistribution" />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h5>Diagnose Kategorien pro Variante</h5>
                <div class="row" />
            </div>
            <div>
                <h5>HPO Terme pro Variante</h5>
                <div class="row" />
            </div>
        </template>
    </QuerySummaryEntity>
</template>
