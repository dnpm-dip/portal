<script lang="ts">
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
});
</script>
<template>
    <div>
        <QuerySummaryEntity :query-id="entity.id">
            <template #default="props">
                <div class="row">
                    <div class="col-12 col-xxl-4 col-lg-6">
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
                    <div class="col-12 col-xxl-4 col-lg-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von HPOTermen
                            </h6>
                            <QuerySummaryDistributionBar :items="props.data.hpoTermDistribution" />
                        </div>
                    </div>
                </div>
            </template>
        </QuerySummaryEntity>
    </div>
</template>
