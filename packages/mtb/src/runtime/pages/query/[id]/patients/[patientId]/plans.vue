<script lang="ts">
import { DPatient } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: { DPatient },
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
        <div class="entity-card-group flex-row justify-content-evenly">
            <template
                v-for="(item) in record.carePlans"
                :key="item.id"
            >
                <div class="entity-card flex-grow-1 mb-3">
                    <div class="row mb-3">
                        <div class="col">
                            <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.issuedOn }}</div>
                            <div><strong><i class="fas fa-calculator" /> Indikation</strong> {{ item.indication.type }}</div>
                        </div>
                        <div class="col">
                            <div v-if="item.statusReason">
                                <div>
                                    <strong><i class="fas fa-info-circle" /> Status Grund</strong>
                                    {{ item.statusReason.display || item.statusReason.code }}
                                </div>
                            </div>

                            <div><strong><i class="fas fa-shield" /> Protokoll</strong> {{ item.protocol }}</div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <div class="text-center mb-3">
                                <strong>Medikationen-Empfehlung</strong>
                            </div>
                            <template
                                v-for="(recommendation, recommendationKey) in item.medicationRecommendations"
                                :key="recommendationKey"
                            >
                                <div class="mb-2">
                                    <template v-if="recommendationKey > 0">
                                        <hr>
                                    </template>
                                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ recommendation.issuedOn }}</div>
                                    <div v-if="recommendation.medication">
                                        <strong><i class="fa fa-pills" /> Medikation</strong>
                                        <template
                                            v-for="(el, idx) in recommendation.medication"
                                            :key="el"
                                        >
                                            {{ idx > 0 ? ', ' : '' }} {{ el.display || el.code }}
                                        </template>
                                    </div>
                                    <div v-if="recommendation.supportingEvidence">
                                        <strong><i class="fas fa-check-circle" /> Stützende Evidenz</strong><br>
                                        <template
                                            v-for="(el, idx) in recommendation.supportingEvidence"
                                            :key="el"
                                        >
                                            &bull; {{ idx > 0 ? ', ' : '' }} {{ el.type }}: {{ el.display }}
                                        </template>
                                    </div>
                                    <div v-if="recommendation.priority">
                                        <strong><i class="fa fa-clock" /> Priorität</strong>
                                        {{ recommendation.priority.display || recommendation.priority.code }}
                                    </div>
                                    <template v-if="recommendation.levelOfEvidence">
                                        <div v-if="recommendation.levelOfEvidence.grading">
                                            <strong><i class="fas fa-chart-line" /> Evidenz-Grad</strong>
                                            {{ recommendation.levelOfEvidence.grading.display || recommendation.levelOfEvidence.grading.code }}
                                        </div>
                                        <div v-if="recommendation.levelOfEvidence.addendums">
                                            <strong><i class="fas fa-plus-square" /> Evidenz-Addendums</strong>
                                            <template
                                                v-for="(el, idx) in recommendation.levelOfEvidence?.addendums"
                                                :key="el"
                                            >
                                                {{ idx > 0 ? ', ' : '' }} {{ el.display || el.code }}
                                            </template>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div class="col">
                            <div class="text-center mb-3">
                                <strong>Genetische-Empfehlung</strong>
                            </div>
                            <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.geneticCounselingRecommendation.issuedOn }}</div>
                            <div>
                                <strong><i class="fas fa-lightbulb" /> Grund</strong>
                                {{ item.geneticCounselingRecommendation.reason.display || item.geneticCounselingRecommendation.reason.code }}
                            </div>
                        </div>
                        <div
                            v-if="item.studyEnrollmentRecommendations"
                            class="col"
                        >
                            <div class="text-center mb-3">
                                <strong>Studien-Empfehlung</strong>
                            </div>

                            <template
                                v-for="(recommendation) in item.studyEnrollmentRecommendations"
                                :key="recommendation.id"
                            >
                                <div class="mb-2">
                                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ recommendation.issuedOn }}</div>
                                    <div v-if="recommendation.supportingEvidence">
                                        <strong><i class="fas fa-check-circle" /> Stützende Evidenz</strong><br>
                                        <template
                                            v-for="(el, idx) in recommendation.supportingEvidence"
                                            :key="el"
                                        >
                                            &bull; {{ idx > 0 ? ', ' : '' }} {{ el.type }}: {{ el.display }}
                                        </template>
                                    </div>
                                    <div v-if="recommendation.levelOfEvidence">
                                        <strong><i class="fas fa-chart-line" /> Evidenz-Grad</strong>
                                        {{ recommendation.levelOfEvidence.display || recommendation.levelOfEvidence.code }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>
