<script lang="ts">
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { RDPatientRecord, RDQuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
        record: {
            type: Object as PropType<RDPatientRecord>,
            required: true,
        },
    },
});
</script>
<template>
    <div>
        <div class="row mb-3">
            <h6>Allgemein</h6>
            <div class="col">
                <div><strong><i class="fas fa-user" /> Geschlecht</strong> {{ record.patient.gender.display }}</div>
                <div><strong><i class="fas fa-birthday-cake" /> Geburtstag</strong> {{ record.patient.birthDate }}</div>
            </div>
            <div class="col">
                <template v-if="record.therapy">
                    <div><strong>Therapie</strong> {{ record.therapy.notes }}</div>
                </template>
                <div>
                    <strong>HPO Terme</strong>
                    <template
                        v-for="(item, key) in record.hpoTerms"
                        :key="key"
                    >
                        <span class="badge bg-dark ms-1">{{ item.value.code }}</span>
                    </template>
                </div>
            </div>
        </div>

        <div class="row mb-2">
            <div class="col">
                <h6>Fall</h6>
                <div>
                    <div><strong><i class="fa fa-user" /> Arzt</strong> {{ record.case.referrer.name }}</div>
                    <div><strong><i class="fa fa-clock" /> Aufgenommen</strong> {{ record.case.recordedOn }}</div>
                    <template v-if="record.case.gestaltMatcherId">
                        <div><strong><i class="fa fa-id-card" /> GestaltMatcherID</strong> {{ record.case.gestaltMatcherId.value }}</div>
                    </template>
                    <template v-if="record.case.face2geneId">
                        <div><strong><i class="fa fa-id-card" /> Face2GeneID</strong> {{ record.case.face2geneId.value }}</div>
                    </template>
                </div>
            </div>
            <div class="col">
                <h6>Diagnose</h6>
                <div>
                    <div><strong><i class="fa fa-clock" /> Aufgenommen</strong> {{ record.diagnosis.recordedOn }}</div>
                    <div>
                        <strong><i class="fa-solid fa-tags" /> Kategorien</strong>
                        <template
                            v-for="item in record.diagnosis.categories"
                            :key="item.code"
                        >
                            <span class="ms-1 badge bg-dark">{{ item.display }}</span>
                        </template>
                    </div>
                    <div><strong><i class="fas fa-heartbeat" /> Status</strong> {{ record.diagnosis.status.display }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
