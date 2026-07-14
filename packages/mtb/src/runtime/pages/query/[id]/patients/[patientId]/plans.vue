<script lang="ts">
import { DCodingCommaList } from '@dnpm-dip/core';
import { VCIcon } from '@vuecs/icon';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: { DCodingCommaList, VCIcon },
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
    <template v-if="record.carePlans">
        <div class="entity-card-group flex-row justify-evenly">
            <template
                v-for="(item) in record.carePlans"
                :key="item.id"
            >
                <div class="entity-card grow mb-3">
                    <div class="flex flex-wrap -mx-2 mb-3">
                        <div class="flex-1 basis-0 px-2">
                            <div v-if="item.reason">
                                <strong><VCIcon name="fa6-solid:calculator" /> Grund</strong>
                                {{ item.reason.display || item.reason.type }}
                            </div>
                            <div v-if="item.notes">
                                <strong><VCIcon name="fa6-solid:shield" /> Notizen</strong>
                                <div class="flex flex-col">
                                    <template v-for="note in item.notes">
                                        {{ note }}
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 basis-0 px-2">
                            <div><strong><VCIcon name="fa6-solid:clock" /> Erfassungsdatum</strong> {{ item.issuedOn }}</div>
                            <div v-if="item.noSequencingPerformedReason">
                                <div>
                                    <strong><VCIcon name="fa6-solid:circle-info" /> Grund für keine Sequenzierung</strong>
                                    {{ item.noSequencingPerformedReason.display || item.noSequencingPerformedReason.code }}
                                </div>
                            </div>
                            <div v-if="item.recommendationsMissingReason">
                                <div>
                                    <strong><VCIcon name="fa6-solid:circle-info" /> Grund für fehlende Empfehlung</strong>
                                    {{ item.recommendationsMissingReason.display || item.recommendationsMissingReason.code }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap -mx-2 mt-2">
                        <div
                            v-if="item.medicationRecommendations"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Therapie-Empfehlungen</strong>
                                </div>
                                <template
                                    v-for="(recommendation, recommendationKey) in item.medicationRecommendations"
                                    :key="recommendationKey"
                                >
                                    <div class="mb-2">
                                        <template v-if="recommendationKey > 0">
                                            <hr>
                                        </template>
                                        <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ recommendation.issuedOn }}</div>
                                        <div v-if="recommendation.reason">
                                            <strong><VCIcon name="fa6-solid:calculator" /> Grund</strong>
                                            {{ recommendation.reason.display || recommendation.reason.id }}
                                        </div>
                                        <div v-if="recommendation.medication">
                                            <strong><VCIcon name="fa6-solid:pills" /> Medikation</strong>
                                            <DCodingCommaList :items="recommendation.medication" />
                                        </div>
                                        <div v-if="recommendation.category">
                                            <strong><VCIcon name="fa6-solid:tags" /> Kategorien</strong>
                                            <DCodingCommaList :items="recommendation.category" />
                                        </div>
                                        <div v-if="recommendation.useType">
                                            <strong><VCIcon name="fa6-solid:toolbox" /> Verwendungstyp</strong>
                                            {{ recommendation.useType.display || recommendation.useType.code }}
                                        </div>
                                        <div v-if="recommendation.supportingVariants">
                                            <strong><VCIcon name="fa6-solid:circle-check" /> Stützende molekulare Alterationen</strong><br>
                                            <template
                                                v-for="(el, elKey) in recommendation.supportingVariants"
                                                :key="elKey"
                                            >
                                                <p>&bull; {{ el.display || el.gene?.display || el.variant?.id }}</p>
                                            </template>
                                        </div>
                                        <div v-if="recommendation.priority">
                                            <strong><VCIcon name="fa6-solid:clock" /> Priorität</strong>
                                            {{ recommendation.priority.display || recommendation.priority.code }}
                                        </div>
                                        <template v-if="recommendation.levelOfEvidence">
                                            <div v-if="recommendation.levelOfEvidence.grading">
                                                <strong><VCIcon name="fa6-solid:chart-line" /> Evidenzlevel</strong>
                                                {{ recommendation.levelOfEvidence.grading.display || recommendation.levelOfEvidence.grading.code }}

                                                (<template v-if="recommendation.levelOfEvidence.addendums">
                                                    <DCodingCommaList :items="recommendation.levelOfEvidence.addendums" />
                                                </template>)
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            v-if="item.geneticCounselingRecommendation"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Humangenetische-Empfehlungen</strong>
                                </div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.geneticCounselingRecommendation.issuedOn }}
                                </div>
                                <div>
                                    <strong><VCIcon name="fa6-solid:lightbulb" /> Grund</strong>
                                    {{ item.geneticCounselingRecommendation.reason.display || item.geneticCounselingRecommendation.reason.code }}
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="item.studyEnrollmentRecommendations"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Studien-Einschlussempfehlungen</strong>
                                </div>

                                <template
                                    v-for="(recommendation) in item.studyEnrollmentRecommendations"
                                    :key="recommendation.id"
                                >
                                    <div class="mb-2">
                                        <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ recommendation.issuedOn }}</div>
                                        <div v-if="recommendation.priority">
                                            <strong><VCIcon name="fa6-solid:clock" /> Priorität</strong>
                                            {{ recommendation.priority.display || recommendation.priority.code }}
                                        </div>
                                        <div v-if="recommendation.study && recommendation.study.length > 0">
                                            <strong><VCIcon name="fa6-solid:flask-vial" /> Studien</strong><br>
                                            <template
                                                v-for="study in recommendation.study"
                                                :key="study.id"
                                            >
                                                <p>&bull; {{ study.display || study.id }} <span class="text-fg-muted">({{ study.system }})</span></p>
                                            </template>
                                        </div>
                                        <div v-if="recommendation.supportingVariants">
                                            <strong><VCIcon name="fa6-solid:circle-check" /> Stützende Evidenz</strong><br>
                                            <template
                                                v-for="(el, elKey) in recommendation.supportingVariants"
                                                :key="elKey"
                                            >
                                                <p>&bull; {{ el.display || el.gene?.display || el.variant?.id }}</p>
                                            </template>
                                        </div>
                                        <div v-if="recommendation.levelOfEvidence && recommendation.levelOfEvidence.grading">
                                            <strong><VCIcon name="fa6-solid:chart-line" /> Evidenz-Grad</strong>
                                            {{ recommendation.levelOfEvidence.grading.display || recommendation.levelOfEvidence.grading.code }}
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            v-if="item.procedureRecommendations"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Prozedur-Empfehlungen</strong>
                                </div>
                                <template
                                    v-for="(recommendation, recommendationKey) in item.procedureRecommendations"
                                    :key="recommendation.id"
                                >
                                    <div class="mb-2">
                                        <template v-if="recommendationKey > 0">
                                            <hr>
                                        </template>
                                        <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ recommendation.issuedOn }}</div>
                                        <div v-if="recommendation.reason">
                                            <strong><VCIcon name="fa6-solid:calculator" /> Grund</strong>
                                            {{ recommendation.reason.display || recommendation.reason.id }}
                                        </div>
                                        <div v-if="recommendation.code">
                                            <strong><VCIcon name="fa6-solid:code" /> Code</strong>
                                            {{ recommendation.code.display || recommendation.code.code }}
                                        </div>
                                        <div v-if="recommendation.priority">
                                            <strong><VCIcon name="fa6-solid:clock" /> Priorität</strong>
                                            {{ recommendation.priority.display || recommendation.priority.code }}
                                        </div>
                                        <div v-if="recommendation.supportingVariants">
                                            <strong><VCIcon name="fa6-solid:circle-check" /> Stützende molekulare Alterationen</strong><br>
                                            <template
                                                v-for="(el, elKey) in recommendation.supportingVariants"
                                                :key="elKey"
                                            >
                                                <p>&bull; {{ el.display || el.gene?.display || el.variant?.id }}</p>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="item.rebiopsyRequests || item.histologyReevaluationRequests"
                        class="flex flex-wrap -mx-2 mt-2"
                    >
                        <div
                            v-if="item.rebiopsyRequests"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Rebiopsie-Anforderungen</strong>
                                </div>
                                <template
                                    v-for="request in item.rebiopsyRequests"
                                    :key="request.id"
                                >
                                    <div>
                                        <strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ request.issuedOn }}
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            v-if="item.histologyReevaluationRequests"
                            class="flex-1 basis-0 px-2"
                        >
                            <div class="entity-card">
                                <div class="text-center mb-3">
                                    <strong>Histologie-Reevaluierungen</strong>
                                </div>
                                <template
                                    v-for="request in item.histologyReevaluationRequests"
                                    :key="request.id"
                                >
                                    <div>
                                        <strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ request.issuedOn }}
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>

    <template v-if="record.claims && record.claims.length > 0">
        <h5 class="section-label mb-2">
            Kostenübernahme-Anträge
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.claims"
                :key="item.id"
            >
                <div class="entity-card">
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                    <div v-if="item.stage">
                        <strong><VCIcon name="fa6-solid:layer-group" /> Stufe</strong>
                        {{ item.stage.display || item.stage.code }}
                    </div>
                    <div v-if="item.requestedMedication && item.requestedMedication.length > 0">
                        <strong><VCIcon name="fa6-solid:pills" /> Beantragte Medikation</strong>
                        <DCodingCommaList :items="item.requestedMedication" />
                    </div>
                </div>
            </template>
        </div>
    </template>

    <template v-if="record.claimResponses && record.claimResponses.length > 0">
        <h5 class="section-label mb-2">
            Antworten auf Kostenübernahme-Anträge
        </h5>
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <template
                v-for="item in record.claimResponses"
                :key="item.id"
            >
                <div class="entity-card">
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.issuedOn }}</div>
                    <div v-if="item.status">
                        <strong><VCIcon name="fa6-solid:circle-check" /> Status</strong>
                        {{ item.status.display || item.status.code }}
                    </div>
                    <div v-if="item.statusReason && item.statusReason.length > 0">
                        <strong><VCIcon name="fa6-solid:circle-info" /> Status Grund</strong>
                        <DCodingCommaList :items="item.statusReason" />
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>
