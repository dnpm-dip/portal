<script lang="ts">
import { DChartBar, DQuerySummaryGrouped } from '@dnpm-dip/core';
import { type PropType, defineComponent } from 'vue';
import type { QuerySummaryDiagnostics } from '../../domains';

export default defineComponent({
    components: {
        DChartBar,
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
        <h5>Insgesamt</h5>

        <div class="row">
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        Verteilung von Diagnose Kategorien
                    </h6>
                    <DChartBar :items="entity.overall.diseaseCategoryDistribution" />
                </div>
            </div>
            <div class="col-12 col-xl-6">
                <div class="entity-card text-center mb-3 w-100">
                    <h6 class="text-center">
                        Verteilung von HPOTermen
                    </h6>
                    <DChartBar
                        :items="entity.overall.hpoTermDistribution"
                    />
                </div>
            </div>
        </div>

        <hr>

        <h5>Varianten</h5>

        <DQuerySummaryGrouped
            :label="'Variante'"
            :items="entity.variants"
        >
            <template #default="{ item }">
                <div class="row">
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von Diagnose Kategorien
                            </h6>
                            <DChartBar :items="item.value.diseaseCategoryDistribution" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="entity-card text-center mb-3 w-100">
                            <h6 class="text-center">
                                Verteilung von HPO Termen
                            </h6>
                            <DChartBar :items="item.value.hpoTermDistribution" />
                        </div>
                    </div>
                </div>
            </template>
        </DQuerySummaryGrouped>
    </div>
</template>
