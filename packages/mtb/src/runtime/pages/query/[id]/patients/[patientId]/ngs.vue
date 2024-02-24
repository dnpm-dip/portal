<script lang="ts">
import { DExpandableContent } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import MNGSReportCNV from '../../../../../components/core/MNGSReportCNV.vue';
import MNgsReportSNV from '../../../../../components/core/MNGSReportSNV.vue';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: { DExpandableContent, MNGSReportCNV, MNgsReportSNV },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
        record: {
            type: Object as PropType<PatientRecord>,
            required: true,
        },
    },
});
</script>
<template>
    <template v-if="record.ngsReports">
        <template
            v-for="(item) in record.ngsReports"
            :key="item.id"
        >
            <div>
                <h5>Bericht <small class="text-muted">{{ item.id }}</small></h5>
            </div>
            <div class="mb-3">
                <div class="row">
                    <div class="col">
                        <div>
                            <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.issuedOn }}</div>
                            <div><strong><i class="fa fa-dna" /> Sequenzierungs-Typ</strong> {{ item.sequencingType }}</div>
                        </div>
                    </div>
                    <div class="col">
                        <template v-if="item.results.tumorCellContent">
                            <div><strong>Tumorzellinhalt</strong> {{ (item.results.tumorCellContent.value * 100).toFixed(2) }}%</div>
                        </template>
                        <template v-if="item.results.brcaness">
                            <div><strong>Brcaness</strong> {{ (item.results.brcaness.value * 100).toFixed(2) }}%</div>
                        </template>
                        <template v-if="item.results.tmb">
                            <div><strong>Mutationslast</strong> {{ item.results.tmb.value.value }} ({{ item.results.tmb.value.unit }})</div>
                        </template>
                        <template v-if="item.results.hrdScore">
                            <div><strong>HRD</strong> {{ item.results.hrdScore.value.toFixed(2) }}</div>
                        </template>
                    </div>
                </div>
            </div>

            <DExpandableContent>
                <template #header>
                    <h6>SNV</h6>
                </template>
                <template #default>
                    <template
                        v-for="snv in item.results.simpleVariants"
                        :key="snv.id"
                    >
                        <MNgsReportSNV
                            :entity="snv"
                            class="mb-1"
                        />
                    </template>
                </template>
            </DExpandableContent>

            <DExpandableContent>
                <template #header>
                    <h6>CNV</h6>
                </template>
                <template #default>
                    <template
                        v-for="cnv in item.results.copyNumberVariants"
                        :key="cnv.id"
                    >
                        <MNGSReportCNV
                            :entity="cnv"
                            class="mb-1"
                        />
                    </template>
                </template>
            </DExpandableContent>

            <DExpandableContent>
                <template #header>
                    <h6>DNA Fusions</h6>
                </template>
                <template #default>
                    {{ item.results.dnaFusions }}
                </template>
            </DExpandableContent>

            <DExpandableContent>
                <template #header>
                    <h6>RNA Fusions</h6>
                </template>
                <template #default>
                    {{ item.results.rnaFusions }}
                </template>
            </DExpandableContent>
        </template>
    </template>
    <template v-else>
        <div class="alert alert-sm alert-info">
            Es sind keine NGS-Reports vorhanden.
        </div>
    </template>
</template>
