<script lang="ts">
import { DFact } from '@dnpm-dip/core';
import { VCAlert } from '@vuecs/elements';
import { VCIcon } from '@vuecs/icon';
import type { PropType } from 'vue';
import { defineNuxtComponent } from '#app';
import type { PatientRecord, QuerySession } from '../../../../../domains';

const SUBMISSION_TYPE_LABELS: Record<string, string> = {
    initial: 'Erstmeldung',
    correction: 'Korrektur',
    test: 'Test',
    addition: 'Ergänzung',
    followup: 'Follow-Up',
};

const PURPOSE_LABELS: Record<string, string> = {
    'case-identification': 'Fallidentifikation',
    reidentification: 'Reidentifikation',
    sequencing: 'Sequenzierung',
};

const PROVISION_TYPE_LABELS: Record<string, string> = {
    permit: 'Erlaubt',
    deny: 'Abgelehnt',
};

const CONSENT_MISSING_LABELS: Record<string, string> = {
    'organizational-issues': 'Organisatorische Gründe',
    'technical-issues': 'Technische Gründe',
    'patient-inability': 'Patient nicht einwilligungsfähig',
    'other-patient-reason': 'Anderer patientenbezogener Grund',
    'consent-not-returned': 'Einwilligung nicht zurückerhalten',
    'patient-refusal': 'Ablehnung durch Patient',
};

export default defineNuxtComponent({
    components: {
        DFact,
        VCAlert,
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
    methods: {
        submissionTypeLabel(value: string) {
            return SUBMISSION_TYPE_LABELS[value] || value;
        },
        purposeLabel(value: string) {
            return PURPOSE_LABELS[value] || value;
        },
        provisionTypeLabel(value: string) {
            return PROVISION_TYPE_LABELS[value] || value;
        },
        consentMissingLabel(value: string) {
            return CONSENT_MISSING_LABELS[value] || value;
        },
    },
});
</script>
<template>
    <template v-if="record.metadata">
        <h5 class="section-label mb-2">
            Meldung
        </h5>
        <div class="entity-card mb-4">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <DFact
                    label="Meldungstyp"
                    icon="fa6-solid:file-arrow-up"
                >
                    {{ submissionTypeLabel(record.metadata.type) }}
                </DFact>
                <DFact
                    label="Transfer-TAN"
                    icon="fa6-solid:hashtag"
                >
                    <span class="font-mono text-xs">{{ record.metadata.transferTAN }}</span>
                </DFact>
                <DFact
                    v-if="record.metadata.episodeOfCare"
                    label="Fall"
                    icon="fa6-solid:folder-open"
                >
                    {{ record.metadata.episodeOfCare.display || record.metadata.episodeOfCare.id }}
                </DFact>
            </div>
        </div>

        <template v-if="record.metadata.modelProjectConsent">
            <h5 class="section-label mb-2">
                Modellvorhaben-Einwilligung
            </h5>
            <div class="entity-card mb-4">
                <div class="mb-3 flex flex-wrap items-center gap-x-8 gap-y-2">
                    <DFact
                        label="Version"
                        icon="fa6-solid:code-branch"
                    >
                        {{ record.metadata.modelProjectConsent.version }}
                    </DFact>
                    <DFact
                        v-if="record.metadata.modelProjectConsent.date"
                        label="Datum"
                        icon="fa6-solid:calendar-day"
                    >
                        {{ record.metadata.modelProjectConsent.date }}
                    </DFact>
                </div>

                <h6 class="section-label mb-2">
                    Regelungen
                </h6>
                <div class="flex flex-col gap-2">
                    <template
                        v-for="(provision, provisionKey) in record.metadata.modelProjectConsent.provisions"
                        :key="provisionKey"
                    >
                        <div class="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3 py-2">
                            <div class="min-w-0">
                                <div class="text-sm font-medium">
                                    {{ purposeLabel(provision.purpose) }}
                                </div>
                                <div class="text-xs text-fg-muted">
                                    {{ provision.date }}
                                </div>
                            </div>
                            <span
                                class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                                :class="provision.type === 'permit'
                                    ? 'bg-success-500/10 text-success-600'
                                    : 'bg-error-500/10 text-error-600'"
                            >
                                <VCIcon :name="provision.type === 'permit' ? 'fa6-solid:check' : 'fa6-solid:xmark'" />
                                {{ provisionTypeLabel(provision.type) }}
                            </span>
                        </div>
                    </template>
                </div>
            </div>
        </template>

        <template
            v-if="(record.metadata.researchConsents && record.metadata.researchConsents.length > 0)
                || record.metadata.reasonResearchConsentMissing"
        >
            <h5 class="section-label mb-2">
                Forschungs-Einwilligungen
            </h5>
            <div class="entity-card mb-4">
                <div v-if="record.metadata.researchConsents && record.metadata.researchConsents.length > 0">
                    <VCIcon name="fa6-solid:file-signature" />
                    {{ record.metadata.researchConsents.length }} Einwilligung(en) hinterlegt
                </div>
                <div
                    v-if="record.metadata.reasonResearchConsentMissing"
                    class="text-error-600"
                >
                    <strong><VCIcon name="fa6-solid:triangle-exclamation" /> Grund für fehlende Einwilligung</strong>
                    {{ consentMissingLabel(record.metadata.reasonResearchConsentMissing) }}
                </div>
            </div>
        </template>
    </template>
    <template v-else>
        <VCAlert
            color="info"
            variant="soft"
            size="sm"
        >
            Es sind keine Metadaten vorhanden.
        </VCAlert>
    </template>
</template>
