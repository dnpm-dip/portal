<script lang="ts">
import {
    DCodingCommaList, 
    DCodingText, 
    DCommaList, 
    DPatient,
} from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
        DCodingText,
        DCodingCommaList,
        DCommaList,
        DPatient,
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

        <hr>

        <div class="row mb-3">
            <div class="col">
                <h5>Fall</h5>

                <div class="entity-card-group flex-col">
                    <template
                        v-for="(item) in record.episodesOfCare"
                        :key="item.id"
                    >
                        <div class="entity-card">
                            <div v-if="item.transferTan">
                                <strong><VCIcon name="fa6-solid:id-card" /> TransferTan</strong>
                                {{ item.transferTan }}
                            </div>
                            <div>
                                <strong><VCIcon name="fa6-solid:clock" /> Datum</strong>
                                {{ item.period.start }} <template v-if="item.period.end">
                                    - {{ item.period.end }}
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="col">
                <h5>Diagnose</h5>
                <div class="flex flex-col gap-2">
                    <template
                        v-for="(diagnosis, key) in record.diagnoses"
                        :key="key"
                    >
                        <div
                            class="entity-card"
                        >
                            <div>
                                <strong><VCIcon name="fa6-solid:clock" /> Datum</strong>
                                {{ diagnosis.recordedOn }}
                            </div>
                            <div v-if="diagnosis.familyControlLevel">
                                <strong><VCIcon name="fa6-solid:house-user" /> Family Control Level</strong>
                                <DCodingText :entity="diagnosis.familyControlLevel" />
                            </div>
                            <div v-if="diagnosis.missingCodeReason">
                                <strong><VCIcon name="fa6-solid:circle-question" /> Grund für fehlenden Code</strong>
                                {{ diagnosis.missingCodeReason }}
                            </div>
                            <div>
                                <strong><VCIcon name="fa6-solid:tags" /> Kategorien</strong>
                                <template
                                    v-for="item in diagnosis.codes"
                                    :key="item.code"
                                >
                                    <span class="ms-1 badge bg-fg">{{ item.display || item.code }}</span>
                                </template>
                            </div>
                            <div>
                                <strong><VCIcon name="fa6-solid:spinner" /> Status</strong>
                                {{ diagnosis.verificationStatus.display }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <hr>

        <div class="mb-3">
            <h5>
                HPO
            </h5>
            <div class="entity-card">
                <div>
                    <strong><VCIcon name="fa6-solid:tags" /> Terme</strong>
                    <template
                        v-for="(item, key) in record.hpoTerms"
                        :key="key"
                    >
                        <span class="badge bg-fg ms-1">{{ item.value.display || item.value.code }}</span>
                    </template>
                </div>
            </div>
        </div>

        <hr>

        <div v-if="record.therapies">
            <h5 class="mb-0">
                Therapien
            </h5>
            <div class="flex flex-col gap-2">
                <template
                    v-for="(item, index) in record.therapies"
                    :key="index"
                >
                    <div
                        v-if="item.history[0]"
                        class="entity-card"
                    >
                        <div>
                            <strong><VCIcon name="fa6-solid:pills" /> Medikation</strong>
                            <template
                                v-for="(el, idx) in item.history[0].medication"
                                :key="el"
                            >
                                {{ idx > 0 ? ', ' : '' }} {{ el.display || el.code }}
                            </template>
                        </div>
                        <div v-if="item.history[0].period">
                            <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                            {{ item.history[0].period.start }} - {{ item.history[0].period.end }}
                        </div>
                        <div v-if="item.history[0].category">
                            <strong><VCIcon name="fa6-solid:tags" /> Status</strong>
                            {{ item.history[0].category.display || item.history[0].category.code }}
                        </div>
                        <div v-if="item.history[0].type">
                            <strong><VCIcon name="fa6-solid:layer-group" /> Type</strong>
                            {{ item.history[0].type.display || item.history[0].type.code }}
                        </div>
                        <div v-if="item.history[0].medication">
                            <strong><VCIcon name="fa6-solid:pills" /> Medikation</strong>
                            <DCodingCommaList :items="item.history[0].medication" />
                        </div>
                        <div v-if="item.history[0].period">
                            <strong><VCIcon name="fa6-solid:calendar-days" /> Zeitraum</strong>
                            {{ item.history[0].period.start }}
                            <template v-if="item.history[0].period.end">
                                - {{ item.history[0].period.end }}
                            </template>
                        </div>
                        <div v-if="item.history[0].notes">
                            <strong><VCIcon name="fa6-solid:note-sticky" /> Notiz</strong>
                            <DCommaList :items="item.history[0].notes" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
