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
                                :items="props.data.distributions.site"
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
                                :items="props.data.distributions.gender"
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
                                :items="props.data.distributions.age"
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
                                :items="props.data.distributions.hpoTerm"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von Diagnose Kategorien
                            </h6>
                            <QuerySummaryDistributionBar :items="props.data.distributions.diseaseCategory" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </QuerySummaryEntity>
</template>
