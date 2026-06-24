<script lang="ts">
import { DCodingCommaList } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: { DCodingCommaList },
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
                            <div>
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
                                                v-for="el in recommendation.supportingVariants"
                                                :key="el.id"
                                            >
                                                <p>&bull; {{ el.display }}</p>
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
                                        <div v-if="recommendation.supportingVariants">
                                            <strong><VCIcon name="fa6-solid:circle-check" /> Stützende Evidenz</strong><br>
                                            <template
                                                v-for="el in recommendation.supportingVariants"
                                                :key="el.id"
                                            >
                                                <p>&bull; {{ el.display }}</p>
                                            </template>
                                        </div>
                                        <div v-if="recommendation.levelOfEvidence">
                                            <strong><VCIcon name="fa6-solid:chart-line" /> Evidenz-Grad</strong>
                                            {{ recommendation.levelOfEvidence.display || recommendation.levelOfEvidence.code }}
                                        </div>

                                    <!-- todo: studien anzeigen -->
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>
