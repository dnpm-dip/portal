<script lang="ts">
import { DCodingCommaList, DCommaList } from '@dnpm-dip/core';
import { VCIcon } from '@vuecs/icon';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        DCodingCommaList, 
        DCommaList, 
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
    <template v-if="record.followUps && record.followUps.length > 0">
        <div>
            <h5 class="section-label mb-2">
                Follow-Ups
            </h5>
        </div>
        <div class="entity-card-group flex-row justify-evenly mb-3">
            <template
                v-for="(item, key) in record.followUps"
                :key="key"
            >
                <div class="entity-card grow">
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.date }}</div>
                    <div v-if="item.lastContactDate">
                        <strong><VCIcon name="fa6-solid:calendar-check" /> Letzter Kontakt</strong>
                        {{ item.lastContactDate }}
                    </div>
                    <div v-if="item.patientStatus">
                        <strong><VCIcon name="fa6-solid:heart-pulse" /> Patientenstatus</strong>
                        {{ item.patientStatus.display || item.patientStatus.code }}
                    </div>
                </div>
            </template>
        </div>

        <hr>
    </template>

    <template v-if="record.systemicTherapies">
        <div>
            <h5 class="section-label mb-2">
                Durchgeführte Therapien
            </h5>
        </div>
        <template
            v-for="(history, key) in record.systemicTherapies"
            :key="key"
        >
            <template
                v-for="item in history.history.slice(0, 1)"
                :key="item.id"
            >
                <div class="entity-card mb-3">
                    <div class="flex flex-wrap -mx-2">
                        <div class="flex-1 basis-0 px-2">
                            <div>
                                <div><strong><VCIcon name="fa6-solid:clock" /> Erfassungsdatum</strong> {{ item.recordedOn }}</div>
                            </div>
                            <div>
                                <div v-if="item.status">
                                    <strong><VCIcon name="fa6-solid:circle-check" /> Status</strong>
                                    {{ item.status.display || item.status.code }}

                                    <template v-if="item.statusReason">
                                        aufgrund von {{ item.statusReason.display || item.statusReason.code }}
                                    </template>
                                </div>
                            </div>
                            <div v-if="item.medication">
                                <strong><VCIcon name="fa6-solid:pills" /> Medikation</strong>
                                <DCodingCommaList :items="item.medication" />
                            </div>
                        </div>
                        <div class="flex-1 basis-0 px-2">
                            <div v-if="item.period">
                                <div>
                                    <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                                    {{ item.period.start }} <template v-if="item.period.end">
                                        - {{ item.period.end }}
                                    </template>
                                </div>
                            </div>
                            <div v-if="item.dosage">
                                <strong><VCIcon name="fa6-solid:syringe" /> Dosierung</strong>
                                {{ item.dosage.display || item.dosage.code }}
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
                            <div v-if="item.notes">
                                <div>
                                    <strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong>
                                    <DCommaList :items="item.notes" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </template>

    <hr>

    <template v-if="record.responses">
        <div>
            <h5 class="section-label mb-2">
                Responses
            </h5>
        </div>
        <div class="entity-card-group flex-row justify-evenly">
            <template
                v-for="(item) in record.responses"
                :key="item.id"
            >
                <div class="entity-card grow mb-3">
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.effectiveDate }}</div>
                    <div><strong><VCIcon name="fa6-solid:calculator" /> Code</strong> {{ item.value.display || item.value.code }}</div>
                    <div v-if="item.method">
                        <strong><VCIcon name="fa6-solid:flask" /> Methode</strong>
                        {{ item.method.display || item.method.code }}
                    </div>
                    <div v-if="item.therapy">
                        <strong><VCIcon name="fa6-solid:calculator" /> Indikation</strong>
                        {{ item.therapy.display || item.therapy.type }}
                    </div>
                </div>
            </template>
        </div>
    </template>
</template>
