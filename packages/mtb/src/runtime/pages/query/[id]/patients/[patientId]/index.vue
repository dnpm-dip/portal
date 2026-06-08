<script lang="ts">
import { DCommaList, DPatient } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: { DCommaList, DPatient },
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

        <hr>

        <h5>Fälle</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.episodesOfCare"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div class="row">
                        <div class="col">
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

        <hr>

        <h5>Leitlinien-Therapien</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.guidelineTherapies"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div class="row">
                        <div class="col">
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
                            <div v-if="item.therapyLine">
                                <strong><VCIcon name="fa6-solid:stethoscope" /> Therapie Linie</strong>
                                {{ item.therapyLine }}
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

        <hr>

        <!-- todo: add diagnosis -->

        <h5>Leitlinien-Prozeduren</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.guidelineProcedures"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
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

        <hr>

        <!-- todo maybe visualisation ?? -->
        <h5>ECOG Performance Status</h5>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.performanceStatus"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div><strong><VCIcon name="fa6-solid:code" /> Code</strong> {{ item.value.display || item.value.code }}</div>
                    <div><strong><VCIcon name="fa6-solid:clock" /> Datum</strong> {{ item.effectiveDate }}</div>
                </div>
            </template>
        </div>
    </div>
</template>
