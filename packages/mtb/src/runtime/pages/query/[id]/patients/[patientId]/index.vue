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
    <div>
        <DPatient
            class="mb-3"
            :entity="record.patient"
        />
        <hr>
        <h6>Fälle</h6>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.episodes"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div class="row">
                        <div class="col">
                            <div>
                                <div><strong><i class="fas fa-calculator" /> TAN</strong> {{ item.ttan }}</div>
                                <div><strong><i class="fas fa-calendar-alt" /> Period</strong> {{ item.period.start }}</div>
                                <div><strong><i class="fas fa-check-circle" /> Status</strong> {{ item.status.display || item.status.code }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <hr>
        <h6>Leitlinien-Therapien</h6>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.guidelineMedicationTherapies"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div class="row">
                        <div class="col">
                            <div>
                                <strong><i class="fa fa-pills" /> Medikation</strong>
                                <template
                                    v-for="(el, idx) in item.medication"
                                    :key="el"
                                >
                                    {{ idx > 0 ? ', ' : '' }} {{ el.display || el.code }}
                                </template>
                            </div>
                            <div><strong><i class="fas fa-calculator" /> Indikation</strong> {{ item.indication.type }}</div>
                            <div>
                                <strong><i class="fas fa-calendar-alt" /> Period</strong>
                                {{ item.period.start }} - {{ item.period.end }}
                            </div>
                            <div>
                                <strong><i class="fas fa-check-circle" /> Status</strong>
                                {{ item.status.display || item.status.code }}
                            </div>
                            <div>
                                <strong><i class="fas fa-info-circle" /> Status Grund</strong>
                                {{ item.statusReason.display || item.statusReason.code }}
                            </div>
                            <div>
                                <strong><i class="far fa-sticky-note" /> Notiz</strong>
                                {{ item.note }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <hr>

        <h6>Leitlinien-Prozeduren</h6>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.guidelineProcedures"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div><strong><i class="fas fa-calculator" /> Indikation</strong> {{ item.indication.type }}</div>
                    <div><strong><i class="fa fa-code" /> Code</strong> {{ item.code.display }}</div>
                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.recordedOn }}</div>
                    <div>
                        <strong><i class="fas fa-calendar-alt" /> Period</strong>
                        {{ item.period.start }} - {{ item.period.end }}
                    </div>
                    <div>
                        <strong><i class="fas fa-check-circle" /> Status</strong>
                        {{ item.status.display || item.status.code }}
                    </div>
                    <div>
                        <strong><i class="fas fa-info-circle" /> Status Grund</strong>
                        {{ item.statusReason.display || item.statusReason.code }}
                    </div>
                    <div>
                        <strong><i class="far fa-sticky-note" /> Notiz</strong>
                        {{ item.note }}
                    </div>
                </div>
            </template>
        </div>

        <hr>

        <h6>ECOG Performance Status</h6>
        <div class="entity-card-group mb-3">
            <template
                v-for="item in record.performanceStatus"
                :key="item.id"
            >
                <div
                    class="entity-card"
                    style="max-width: 350px"
                >
                    <div><strong><i class="fa fa-code" /> Code</strong> {{ item.value.display || item.value.code }}</div>
                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ item.effectiveDate }}</div>
                </div>
            </template>
        </div>
    </div>
</template>
