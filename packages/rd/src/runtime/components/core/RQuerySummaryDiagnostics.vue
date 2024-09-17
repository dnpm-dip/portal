<script lang="ts">
import { DKVChart, DQuerySummaryGrouped } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        DKVChart,
        DQuerySummaryGrouped,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySummaryDiagnostics>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <h5>Gesamtverteilung</h5>

        <div class="row">
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        Diagnose Kategorien
                    </h6>
                    <DKVChart :items="entity.overallDistributions.diseaseCategories.elements" />
                </div>
            </div>
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        HPOTermen
                    </h6>
                    <DKVChart
                        :items="entity.overallDistributions.hpoTerms.elements"
                    />
                </div>
            </div>
        </div>

        <hr>

        <h5>Verteilung nach Varianten</h5>

        <DQuerySummaryGrouped
            :label="'Variante'"
            :items="entity.distributionsByVariant"
        >
            <template #default="{ item }">
                <div class="row">
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Diagnose Kategorien
                            </h6>
                            <DKVChart :items="item.value.diseaseCategories.elements" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                HPO Termen
                            </h6>
                            <DKVChart :items="item.value.hpoTerms.elements" />
                        </div>
                    </div>
                </div>
            </template>
        </DQuerySummaryGrouped>
    </div>
</template>
