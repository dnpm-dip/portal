<script lang="ts">
import { DCodingCommaList, DCommaList, DPatient } from '@dnpm-dip/core';
import { VCIcon } from '@vuecs/icon';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        DCodingCommaList,
        DCommaList,
        DPatient,
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
    <div>
        <DPatient
            class="mb-3"
            :entity="record.patient"
        />

        <h5 class="section-label mb-2">
            Fälle
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.episodesOfCare"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="flex flex-wrap -mx-2">
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <!-- <div><strong><VCIcon name="fa6-solid:calculator" /> TAN</strong> {{ item.ttan }}</div> -->
                                <div>
                                    <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                                    {{ item.period.start }}
                                    <template v-if="item.period.end">
                                        - {{ item.period.end }}
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <template v-if="record.diagnoses && record.diagnoses.length > 0">
            <h5 class="section-label mb-2">
                Diagnosen
            </h5>
            <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <template
                    v-for="item in record.diagnoses"
                    :key="item.id"
                >
                    <div class="entity-card">
                        <div>
                            <strong><VCIcon name="fa6-solid:code" /> Code</strong>
                            {{ item.code.display || item.code.code }}
                        </div>
                        <div v-if="item.topography">
                            <strong><VCIcon name="fa6-solid:compass" /> Topographie</strong>
                            {{ item.topography.display || item.topography.code }}
                        </div>
                        <template v-if="item.type && item.type.history.length > 0">
                            <div>
                                <strong><VCIcon name="fa6-solid:tag" /> Typ</strong>
                                {{ item.type.history[0].value.display || item.type.history[0].value.code }}
                                <span class="text-fg-muted">({{ item.type.history[0].date }})</span>
                            </div>
                        </template>
                        <div><strong><VCIcon name="fa6-solid:clock" /> Erfassungsdatum</strong> {{ item.recordedOn }}</div>
                        <div v-if="item.guidelineTreatmentStatus">
                            <strong><VCIcon name="fa6-solid:circle-info" /> Leitlinien-Behandlungsstatus</strong>
                            {{ item.guidelineTreatmentStatus.display || item.guidelineTreatmentStatus.code }}
                        </div>
                        <template v-if="item.staging && item.staging.history.length > 0">
                            <div>
                                <strong><VCIcon name="fa6-solid:layer-group" /> Staging</strong>
                                {{ item.staging.history[0].method.display || item.staging.history[0].method.code }}
                                <span class="text-fg-muted">({{ item.staging.history[0].date }})</span>
                            </div>
                            <div v-if="item.staging.history[0].tnmClassification">
                                <strong><VCIcon name="fa6-solid:ruler" /> TNM</strong>
                                <DCodingCommaList
                                    :items="[
                                        item.staging.history[0].tnmClassification.tumor,
                                        item.staging.history[0].tnmClassification.nodes,
                                        item.staging.history[0].tnmClassification.metastasis,
                                    ]"
                                />
                            </div>
                            <div v-if="item.staging.history[0].otherClassifications">
                                <strong><VCIcon name="fa6-solid:list" /> Weitere Klassifikationen</strong>
                                <DCodingCommaList :items="item.staging.history[0].otherClassifications" />
                            </div>
                        </template>
                        <div v-if="item.grading && item.grading.history.length > 0">
                            <strong><VCIcon name="fa6-solid:signal" /> Grading</strong>
                            <DCodingCommaList :items="item.grading.history[0].codes" />
                        </div>
                        <div v-if="item.germlineCodes && item.germlineCodes.length > 0">
                            <strong><VCIcon name="fa6-solid:dna" /> Keimbahn-Codes</strong>
                            <DCodingCommaList :items="item.germlineCodes" />
                        </div>
                        <div v-if="item.notes && item.notes.length > 0">
                            <strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong>
                            <DCommaList :items="item.notes" />
                        </div>
                    </div>
                </template>
            </div>
        </template>

        <h5 class="section-label mb-2">
            Leitlinien-Therapien
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.guidelineTherapies"
                :key="item.id"
            >
                <div class="entity-card">
                    <div class="flex flex-wrap -mx-2">
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <strong><VCIcon name="fa6-solid:pills" /> Medikation</strong>
                                <template
                                    v-for="(el, idx) in item.medication"
                                    :key="el"
                                >
                                    {{ idx > 0 ? ', ' : '' }} {{ el.display || el.code }}
                                </template>
                            </div>
                            <div v-if="item.reason">
                                <strong><VCIcon name="fa6-solid:calculator" /> Grund</strong>
                                {{ item.reason.display || item.reason.type }}
                            </div>
                            <div v-if="item.period">
                                <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                                {{ item.period.start }} - {{ item.period.end }}
                            </div>
                            <div v-if="item.status">
                                <strong><VCIcon name="fa6-solid:circle-check" /> Status</strong>
                                {{ item.status.display || item.status.code }}
                            </div>
                            <div v-if="item.statusReason">
                                <strong><VCIcon name="fa6-solid:circle-info" /> Status Grund</strong>
                                {{ item.statusReason.display || item.statusReason.code }}
                            </div>
                            <div v-if="item.recordedOn">
                                <strong><VCIcon name="fa6-solid:clock" /> Erfassungsdatum</strong>
                                {{ item.recordedOn }}
                            </div>
                            <div v-if="item.therapyLine">
                                <strong><VCIcon name="fa6-solid:stethoscope" /> Therapie Linie</strong>
                                {{ item.therapyLine }}
                            </div>
                            <div v-if="item.intent">
                                <strong><VCIcon name="fa6-solid:bullseye" /> Absicht</strong>
                                {{ item.intent.display || item.intent.code }}
                            </div>
                            <div v-if="item.category">
                                <strong><VCIcon name="fa6-solid:tags" /> Kategorie</strong>
                                {{ item.category.display || item.category.code }}
                            </div>
                            <div v-if="item.recommendationFulfillmentStatus">
                                <strong><VCIcon name="fa6-solid:list-check" /> Empfehlungs-Erfüllung</strong>
                                {{ item.recommendationFulfillmentStatus.display || item.recommendationFulfillmentStatus.code }}
                            </div>
                            <div v-if="item.dosage">
                                <strong><VCIcon name="fa6-solid:syringe" /> Dosierung</strong>
                                {{ item.dosage.display || item.dosage.code }}
                            </div>
                            <div v-if="item.notes">
                                <strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong>
                                <DCommaList :items="item.notes" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <h5 class="section-label mb-2">
            Leitlinien-Prozeduren
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.guidelineProcedures"
                :key="item.id"
            >
                <div class="entity-card">
                    <div v-if="item.reason">
                        <strong><VCIcon name="fa6-solid:calculator" /> Grund</strong>
                        {{ item.reason.display || item.reason.type }}
                    </div>
                    <div><strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ item.code.display }}</div>
                    <div><strong><VCIcon name="fa6-solid:clock" /> Erfassungsdatum</strong> {{ item.recordedOn }}</div>
                    <div v-if="item.period">
                        <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                        {{ item.period.start }}
                        <template v-if="item.period.end">
                            - {{ item.period.end }}
                        </template>
                    </div>
                    <div>
                        <strong><VCIcon name="fa6-solid:circle-check" /> Status</strong>
                        {{ item.status.display || item.status.code }}
                    </div>
                    <div v-if="item.statusReason">
                        <strong><VCIcon name="fa6-solid:circle-info" /> Status Grund</strong>
                        {{ item.statusReason.display || item.statusReason.code }}
                    </div>
                    <div v-if="item.therapyLine">
                        <strong><VCIcon name="fa6-solid:stethoscope" /> Therapie Linie</strong>
                        {{ item.therapyLine }}
                    </div>
                    <div v-if="item.intent">
                        <strong><VCIcon name="fa6-solid:bullseye" /> Absicht</strong>
                        {{ item.intent.display || item.intent.code }}
                    </div>
                    <div>
                        <strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong>
                        <div class="flex flex-col">
                            <template
                                v-for="(note, index) in item.notes"
                                :key="index"
                            >
                                <div>
                                    {{ note }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- todo maybe visualisation ?? -->
        <h5 class="section-label mb-2">
            ECOG Performance Status
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.performanceStatus"
                :key="item.id"
            >
                <div class="entity-card">
                    <div><strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ item.value.display || item.value.code }}</div>
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.effectiveDate }}</div>
                </div>
            </template>
        </div>

        <template v-if="record.familyMemberHistories && record.familyMemberHistories.length > 0">
            <h5 class="section-label mb-2">
                Familienanamnese
            </h5>
            <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <template
                    v-for="item in record.familyMemberHistories"
                    :key="item.id"
                >
                    <div class="entity-card">
                        <div>
                            <strong><VCIcon name="fa6-solid:people-roof" /> Verwandtschaftsverhältnis</strong>
                            {{ item.relationship.display || item.relationship.code }}
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
