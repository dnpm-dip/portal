<script lang="ts">
import { DPatient } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

export default defineNuxtComponent({
    components: {
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

        <div class="row mb-2">
            <div class="col">
                <h6>Fall</h6>
                <div>
                    <div><strong><i class="fa fa-user" /> Arzt</strong> {{ record.case.referrer.name }}</div>
                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ record.case.recordedOn }}</div>
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
                    <div><strong><i class="fa fa-clock" /> Datum</strong> {{ record.diagnosis.recordedOn }}</div>
                    <div>
                        <strong><i class="fa-solid fa-tags" /> Kategorien</strong>
                        <template
                            v-for="item in record.diagnosis.categories"
                            :key="item.code"
                        >
                            <span class="ms-1 badge bg-dark">{{ item.display }}</span>
                        </template>
                    </div>
                    <div><strong><i class="fas fa-spinner" /> Status</strong> {{ record.diagnosis.status.display }}</div>
                </div>
            </div>
        </div>
        <div class="mb-2">
            <h6>
                HPO
            </h6>
            <div class="col">
                <div>
                    <strong><i class="fa fa-tags" /> Terme</strong>
                    <template
                        v-for="(item, key) in record.hpoTerms"
                        :key="key"
                    >
                        <span class="badge bg-dark ms-1">{{ item.value.display || item.value.code }}</span>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="record.therapy">
            <h6 class="mb-0">
                Therapie
            </h6>
            <div>{{ record.therapy.notes }}</div>
        </div>
    </div>
</template>
