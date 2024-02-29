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
    <template v-if="record.specimens">
        <h5>Tumorproben</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="(item) in record.specimens"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="mb-3">
                        <div>
                            <div>
                                <strong><i class="fas fa-shield" /> Type</strong>
                                {{ item.type.display || item.type.code }}
                            </div>
                            <div>
                                <strong><i class="fa fa-clock" /> Datum</strong>
                                {{ item.collection.date }}
                            </div>
                            <div>
                                <strong><i class="fas fa-flask" /> Methode</strong>
                                {{ item.collection.method.display || item.collection.method.code }}
                            </div>
                            <div>
                                <strong><i class="fas fa-compass" /> Lokalisierung</strong>
                                {{ item.collection.localization.display || item.collection.localization.code }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.histologyReports">
        <h5>Histologie Berichte</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="(item) in record.histologyReports"
                :key="item.id"
            >
                <div
                    class="entity-card"
                >
                    <div class="mb-3">
                        <div>
                            <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.issuedOn }}</div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <div class="text-center mb-1">
                                    Tumor-Morphologie
                                </div>

                                <div><strong><i class="fa fa-code" /> Code</strong> {{ item.results.tumorMorphology.value.display }}</div>
                                <div><strong><i class="far fa-sticky-note" /> Notiz</strong> {{ item.results.tumorMorphology.notes }}</div>
                            </div>
                            <div class="col">
                                <div class="text-center">
                                    Tumor-Zellinhalt
                                </div>

                                <div>
                                    <strong><i class="fa fa-code" /> Wert</strong>
                                    {{ (item.results.tumorCellContent.value * 100).toFixed(2) }}%
                                </div>
                                <div>
                                    <strong><i class="fas fa-flask" /> Methode</strong>
                                    {{ item.results.tumorCellContent.method.display || item.results.tumorCellContent.method.code }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.ihcReports">
        <div class="mb-3">
            <h5>IHC Berichte</h5>
            <template
                v-for="(item) in record.ihcReports"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="mb-3">
                        <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.date }}</div>
                    </div>
                    <DExpandableContent>
                        <template #header>
                            <h6>Ergebnisse der Proteinexpression</h6>
                        </template>
                        <template #default>
                            <div class="entity-card-group">
                                <template
                                    v-for="per in item.proteinExpressionResults"
                                    :key="per.id"
                                >
                                    <div class="entity-card mb-3">
                                        <div><strong><i class="fa fa-code" /> Code</strong> {{ per.protein.display || per.protein.code }}</div>
                                        <div><strong><i class="fa fa-code" /> Wert</strong> {{ per.value.display || per.value.code }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.tpsScore }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.icScore.display || per.icScore.code }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.tcScore.display || per.tcScore.code }}</div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </DExpandableContent>
                    <DExpandableContent>
                        <template #header>
                            <h6>Ergebnisse der MSI-MMR</h6>
                        </template>
                        <template #default>
                            <div class="entity-card-group">
                                <template
                                    v-for="per in item.msiMmrResults"
                                    :key="per.id"
                                >
                                    <div class="entity-card mb-3">
                                        <div><strong><i class="fa fa-code" /> Code</strong> {{ per.protein.display || per.protein.code }}</div>
                                        <div><strong><i class="fa fa-code" /> Wert</strong> {{ per.value.display || per.value.code }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.tpsScore }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.icScore.display || per.icScore.code }}</div>
                                        <div><strong><i class="fa fa-code" /> TPS-Score</strong> {{ per.tcScore.display || per.tcScore.code }}</div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </DExpandableContent>
                </div>
            </template>
        </div>

        <hr>
    </template>
    <template v-if="record.ngsReports">
        <h5>NGS Berichte</h5>
        <template
            v-for="(item) in record.ngsReports"
            :key="item.id"
        >
            <div class="entity-card">
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
            </div>
        </template>
    </template>
    <template v-else>
        <div class="alert alert-sm alert-info">
            Es sind keine NGS-Reports vorhanden.
        </div>
    </template>
</template>
