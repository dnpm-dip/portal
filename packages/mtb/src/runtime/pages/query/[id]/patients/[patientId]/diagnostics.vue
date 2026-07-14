<script lang="ts">
import { DCommaList, DExpandableContent } from '@dnpm-dip/core';
import { VCAlert } from '@vuecs/elements';
import { VCIcon } from '@vuecs/icon';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import MNGSReportCNV from '../../../../../components/core/MNGSReportCNV.vue';
import MngsReportDnaFusion from '../../../../../components/core/MNGSReportDNAFusion.vue';
import MNGSReportRNAFusion from '../../../../../components/core/MNGSReportRNAFusion.vue';
import MNgsReportSNV from '../../../../../components/core/MNGSReportSNV.vue';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        MNGSReportRNAFusion,
        MngsReportDnaFusion,
        DCommaList,
        DExpandableContent,
        MNGSReportCNV,
        MNgsReportSNV,
        VCAlert,
        VCIcon,
    },
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
        <h5 class="section-label mb-2">
            Tumorproben
        </h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.specimens"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="mb-3">
                        <div>
                            <div v-if="item.type">
                                <strong><VCIcon name="fa6-solid:shield" /> Art</strong>
                                {{ item.type.display || item.type.code }}
                            </div>
                            <template v-if="item.collection">
                                <div>
                                    <strong><VCIcon name="fa6-solid:clock" /> Entnahmedatum</strong>
                                    {{ item.collection.date }}
                                </div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:flask" /> Entnahmemethode</strong>
                                    {{ item.collection.method.display || item.collection.method.code }}
                                </div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:compass" /> Lokalisierung</strong>
                                    {{ item.collection.localization.display || item.collection.localization.code }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.histologyReports">
        <h5 class="section-label mb-2">
            Histologie Berichte
        </h5>
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
                            <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                        </div>
                        <div class="flex flex-wrap -mx-2 mt-2">
                            <div class="flex-1 basis-0 px-2">
                                <div class="text-center mb-1">
                                    <strong>Tumor-Morphologie</strong>
                                </div>

                                <div><strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ item.results.tumorMorphology.value.display }}</div>
                                <div><strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong> {{ item.results.tumorMorphology.note }}</div>
                            </div>
                            <div
                                v-if="item.results.tumorCellContent"
                                class="flex-1 basis-0 px-2"
                            >
                                <div class="text-center">
                                    <strong>Tumor-Zellgehalt</strong>
                                </div>

                                <div>
                                    <strong><VCIcon name="fa6-solid:code" /> Wert</strong>
                                    {{ (item.results.tumorCellContent.value * 100).toFixed(2) }}%
                                </div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:flask" /> Methode</strong>
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
            <h5 class="section-label mb-2">
                IHC Berichte
            </h5>
            <template
                v-for="(item) in record.ihcReports"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="mb-3">
                        <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                    </div>
                    <DExpandableContent>
                        <template #header>
                            <h6 class="section-label mb-2">
                                Ergebnisse der Proteinexpression
                            </h6>
                        </template>
                        <template #default>
                            <div class="entity-card-group">
                                <template
                                    v-for="per in item.results.proteinExpression"
                                    :key="per.id"
                                >
                                    <div class="entity-card mb-3">
                                        <div>
                                            <strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ per.protein.display || per.protein.code }}
                                        </div>
                                        <div><strong><VCIcon name="fa6-solid:code" /> Wert</strong> {{ per.value.display || per.value.code }}</div>
                                        <div v-if="typeof per.tpsScore === 'number'">
                                            <strong><VCIcon name="fa6-solid:code" /> TPS-Score</strong> {{ per.tpsScore }}
                                        </div>
                                        <div v-if="typeof per.cpsScore === 'number'">
                                            <strong><VCIcon name="fa6-solid:code" /> CPS-Score</strong> {{ per.cpsScore }}
                                        </div>
                                        <div v-if="per.icScore">
                                            <strong><VCIcon name="fa6-solid:code" /> IC-Score</strong> {{ per.icScore.display || per.icScore.code }}
                                        </div>
                                        <div v-if="per.tcScore">
                                            <strong><VCIcon name="fa6-solid:code" /> TC-Score</strong> {{ per.tcScore.display || per.tcScore.code }}
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </DExpandableContent>
                    <DExpandableContent>
                        <template #header>
                            <h6 class="section-label mb-2">
                                Ergebnisse der MSI-MMR
                            </h6>
                        </template>
                        <template #default>
                            <div class="entity-card-group">
                                <template
                                    v-for="per in item.results.msiMmr"
                                    :key="per.id"
                                >
                                    <div class="entity-card mb-3">
                                        <div>
                                            <strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ per.protein.display || per.protein.code }}
                                        </div>
                                        <div><strong><VCIcon name="fa6-solid:code" /> Wert</strong> {{ per.value.display || per.value.code }}</div>
                                        <div v-if="typeof per.tpsScore === 'number'">
                                            <strong><VCIcon name="fa6-solid:code" /> TPS-Score</strong> {{ per.tpsScore }}
                                        </div>
                                        <div v-if="typeof per.cpsScore === 'number'">
                                            <strong><VCIcon name="fa6-solid:code" /> CPS-Score</strong> {{ per.cpsScore }}
                                        </div>
                                        <div v-if="per.icScore">
                                            <strong><VCIcon name="fa6-solid:code" /> IC-Score</strong> {{ per.icScore.display || per.icScore.code }}
                                        </div>
                                        <div v-if="per.tcScore">
                                            <strong><VCIcon name="fa6-solid:code" /> TC-Score</strong> {{ per.tcScore.display || per.tcScore.code }}
                                        </div>
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

    <template v-if="record.msiFindings && record.msiFindings.length > 0">
        <h5 class="section-label mb-2">
            MSI-Befunde
        </h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.msiFindings"
                :key="item.id"
            >
                <div class="entity-card">
                    <div>
                        <strong><VCIcon name="fa6-solid:flask" /> Methode</strong>
                        {{ item.method.display || item.method.code }}
                    </div>
                    <div>
                        <strong><VCIcon name="fa6-solid:magnifying-glass-chart" /> Interpretation</strong>
                        {{ item.interpretation.display || item.interpretation.code }}
                    </div>
                    <div><strong><VCIcon name="fa6-solid:hashtag" /> Wert</strong> {{ item.value }}</div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.priorDiagnosticReports && record.priorDiagnosticReports.length > 0">
        <h5 class="section-label mb-2">
            Molekulare Vorbefunde
        </h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.priorDiagnosticReports"
                :key="item.id"
            >
                <div class="entity-card">
                    <div>
                        <strong><VCIcon name="fa6-solid:dna" /> Typ</strong>
                        {{ item.type.display || item.type.code }}
                    </div>
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                    <div v-if="item.performer">
                        <strong><VCIcon name="fa6-solid:user-doctor" /> Durchführender</strong>
                        {{ item.performer.display || item.performer.id }}
                    </div>
                    <div v-if="item.results && item.results.length > 0">
                        <strong><VCIcon name="fa6-solid:list" /> Ergebnisse</strong>
                        <DCommaList :items="item.results" />
                    </div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.ngsReports">
        <h5 class="section-label mb-2">
            NGS Berichte
        </h5>
        <template
            v-for="(item) in record.ngsReports"
            :key="item.id"
        >
            <div class="entity-card gap-1 flex flex-col">
                <div class="mb-3">
                    <div class="flex flex-wrap -mx-2">
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}
                                </div>
                                <div>
                                    <strong>
                                        <VCIcon name="fa6-solid:dna" /> Typ</strong>
                                    {{ item.type.display || item.type.code }}
                                </div>
                                <div v-if="item.specimen">
                                    <strong><VCIcon name="fa6-solid:vial" /> Probe</strong>
                                    {{ item.specimen.display || item.specimen.id }}
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 basis-0 px-2">
                            <template v-if="item.results.tumorCellContent">
                                <div><strong>Tumorzellgehalt</strong> {{ (item.results.tumorCellContent.value * 100).toFixed(2) }}%</div>
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

                <DExpandableContent v-if="item.metadata && item.metadata.length > 0">
                    <template #header>
                        <h6 class="section-label mb-2">
                            Metadaten
                        </h6>
                    </template>
                    <template #default>
                        <template
                            v-for="(meta, metaKey) in item.metadata"
                            :key="metaKey"
                        >
                            <div class="entity-card mb-1">
                                <div><strong><VCIcon name="fa6-solid:industry" /> Kit-Hersteller</strong> {{ meta.kitManufacturer }}</div>
                                <div><strong><VCIcon name="fa6-solid:box" /> Kit-Typ</strong> {{ meta.kitType }}</div>
                                <div><strong><VCIcon name="fa6-solid:microchip" /> Sequenzer</strong> {{ meta.sequencer }}</div>
                                <div><strong><VCIcon name="fa6-solid:diagram-project" /> Pipeline</strong> {{ meta.pipeline }}</div>
                                <div><strong><VCIcon name="fa6-solid:dna" /> Referenzgenom</strong> {{ meta.referenceGenome }}</div>
                            </div>
                        </template>
                    </template>
                </DExpandableContent>

                <DExpandableContent>
                    <template #header>
                        <h6 class="section-label mb-2">
                            SNV
                        </h6>
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
                        <h6 class="section-label mb-2">
                            CNV
                        </h6>
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

                <div class="flex flex-wrap -mx-2">
                    <div class="w-6/12 px-2">
                        <DExpandableContent>
                            <template #header>
                                <h6 class="section-label mb-2">
                                    DNA Fusions
                                </h6>
                            </template>
                            <template #default>
                                <template
                                    v-for="el in item.results.dnaFusions"
                                    :key="el.id"
                                >
                                    <MngsReportDnaFusion
                                        :entity="el"
                                        class="mb-1"
                                    />
                                </template>
                            </template>
                        </DExpandableContent>
                    </div>
                    <div class="w-6/12 px-2">
                        <DExpandableContent>
                            <template #header>
                                <h6 class="section-label mb-2">
                                    RNA Fusions
                                </h6>
                            </template>
                            <template #default>
                                <template
                                    v-for="el in item.results.rnaFusions"
                                    :key="el.id"
                                >
                                    <MNGSReportRNAFusion
                                        :entity="el"
                                        class="mb-1"
                                    />
                                </template>
                            </template>
                        </DExpandableContent>
                    </div>
                </div>

                <DExpandableContent v-if="item.results.rnaSeqs && item.results.rnaSeqs.length > 0">
                    <template #header>
                        <h6 class="section-label mb-2">
                            RNA-Seq
                        </h6>
                    </template>
                    <template #default>
                        <div class="entity-card-group">
                            <template
                                v-for="seq in item.results.rnaSeqs"
                                :key="seq.id"
                            >
                                <div class="entity-card mb-1">
                                    <div v-if="seq.gene">
                                        <strong><VCIcon name="fa6-solid:dna" /> Gen</strong>
                                        {{ seq.gene.display || seq.gene.code }}
                                    </div>
                                    <div><strong><VCIcon name="fa6-solid:chart-simple" /> TPM</strong> {{ seq.transcriptsPerMillion }}</div>
                                    <div><strong><VCIcon name="fa6-solid:hashtag" /> Raw Counts</strong> {{ seq.rawCounts }}</div>
                                    <div v-if="typeof seq.cohortRanking === 'number'">
                                        <strong><VCIcon name="fa6-solid:ranking-star" /> Kohorten-Rang</strong>
                                        {{ seq.cohortRanking }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </DExpandableContent>
            </div>
        </template>
    </template>
    <template v-else>
        <VCAlert
            color="info"
            variant="soft"
            size="sm"
        >
            Es sind keine NGS-Reports vorhanden.
        </VCAlert>
    </template>
</template>
