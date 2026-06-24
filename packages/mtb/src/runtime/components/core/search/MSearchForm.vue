<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type Coding,
    type ConnectionPeer,
    DLoadingButton,
    type FormTabInput,
    type ValueSetCoding,
} from '@dnpm-dip/core';
import {
    DCollectionTransform,
    DFormTabGroups,
    DLoadingModal,
    DSitePicker,
    DValueSet,
    LogicalOperator,
    QueryRequestMode,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import {
    VCFormSelectSearch,
} from '@vuecs/forms';
import type { FormOption } from '@vuecs/forms';
import {
    type PropType,
    reactive,
    toRef,
    watch,
} from 'vue';
import { defineComponent, ref } from 'vue';
import { injectHTTPClient } from '../../../core/http-client';
import {
    type QueryCriteria,
    type QueryGeneAlterationCriteria,
    type QueryMedicationCriteria,
    type QuerySession,
    buildQueryGeneAlterationCriteriaLabel,
} from '../../../domains';
import MMutationTabGroup from '../MMutationTabGroup.vue';
import MSearchMedicationForm from './MSearchMedicationForm.vue';

export default defineComponent({
    components: {
        DLoadingButton,
        DSitePicker,
        MSearchMedicationForm,
        MMutationTabGroup,
        DFormTabGroups,
        DValueSet,
        VCFormSelectSearch,
        DLoadingModal,
        DCollectionTransform,
    },
    props: {
        criteria: { type: Object as PropType<QueryCriteria | null> },
        queryId: { type: String },
        queryMode: { type: String as PropType<QueryRequestMode> },
        queryPeers: { type: Array as PropType<ConnectionPeer[]> },
    },
    emits: [
        'failed',

        'created',
        'updated',

        'save',
    ],
    async setup(props, { emit, expose }) {
        const filterStore = useQueryFilterStore();
        const apiClient = injectHTTPClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeSites = ref<Coding[]>([]);
        const modeOptions : FormOption[] = [
            { value: QueryRequestMode.LOCAL, label: 'Lokal: eigener Standort' },
            { value: QueryRequestMode.FEDERATED, label: 'Föderiert: alle Standorte' },
            { value: QueryRequestMode.CUSTOM, label: 'Nutzer-definiert: gezielte Standort-Auswahl' },
        ];

        const busy = ref(false);
        const criteria = toRef(props, 'criteria');

        const expanded = reactive({
            alteration: false,
            diagnosis: false,
            medication: false,
            response: false,
            mode: false,
        });

        const toggleExpanded = (name: keyof typeof expanded) => {
            expanded[name] = !expanded[name];
        };

        const mutations = ref<FormTabInput<QueryGeneAlterationCriteria>[]>([]);
        const mutationsInCombination = ref(false);

        const diagnoses = ref<string[]>([]);
        const tumorMorphologies = ref<string[]>([]);

        const medicationDrugs = ref<Coding[]>([]);
        const medicationUsage = ref<string[]>([]);
        const medicationInCombination = ref(false);

        const responses = ref<string[]>([]);

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            if (props.queryPeers) {
                modeSites.value = props.queryPeers.map((peer) => peer.site);
            }

            diagnoses.value = [];
            tumorMorphologies.value = [];
            medicationDrugs.value = [];
            medicationUsage.value = [];
            medicationInCombination.value = false;
            responses.value = [];
            mutations.value = [];

            if (criteria.value) {
                if (criteria.value.tumorEntities) {
                    diagnoses.value = criteria.value.tumorEntities.map((item) => `${item.code}`);
                }

                if (criteria.value.tumorMorphologies) {
                    tumorMorphologies.value = criteria.value.tumorMorphologies.map((item) => `${item.code}`);
                }

                if (criteria.value.medication) {
                    if (criteria.value.medication.items) {
                        medicationDrugs.value = criteria.value.medication.items;
                    }

                    if (criteria.value.medication.usage) {
                        medicationUsage.value = criteria.value.medication.usage.map((e) => e.code);
                    }

                    if (criteria.value.medication.operator) {
                        medicationInCombination.value = criteria.value.medication.operator === LogicalOperator.AND;
                    }
                }

                if (criteria.value.responses) {
                    responses.value = criteria.value.responses.map((item) => `${item.code}`);
                }

                if (
                    criteria.value &&
                    criteria.value.geneAlterations &&
                    criteria.value.geneAlterations.items &&
                    criteria.value.geneAlterations.items.length > 0
                ) {
                    mutations.value = criteria.value.geneAlterations.items.map((item) => ({
                        data: item,
                        label: buildQueryGeneAlterationCriteriaLabel(item),
                    }));

                    if (criteria.value.geneAlterations.operator) {
                        mutationsInCombination.value = criteria.value.geneAlterations.operator === LogicalOperator.AND;
                    }
                }
            }

            busy.value = false;
        };

        watch(criteria, (newVal, oldVal) => {
            if (newVal === oldVal) {
                return;
            }

            reset();
        });

        const buildCriteria = () : QueryCriteria => {
            const payload : QueryCriteria = {};

            if (
                diagnoses.value &&
                diagnoses.value.length > 0
            ) {
                payload.tumorEntities = diagnoses.value.map((code) => ({ code }));
            }

            if (
                tumorMorphologies.value &&
                tumorMorphologies.value.length > 0
            ) {
                payload.tumorMorphologies = tumorMorphologies.value.map((code) => ({ code }));
            }

            const payloadMedication : QueryMedicationCriteria = {};

            if (
                medicationDrugs.value &&
                medicationDrugs.value.length > 0
            ) {
                payloadMedication.items = medicationDrugs.value;
            }

            if (
                medicationUsage.value &&
                medicationUsage.value.length > 0
            ) {
                payloadMedication.usage = medicationUsage.value.map((item) => ({ code: item }));
            }

            if (medicationInCombination.value) {
                payloadMedication.operator = LogicalOperator.AND;
            } else {
                payloadMedication.operator = LogicalOperator.OR;
            }

            if (payloadMedication.items) {
                payload.medication = payloadMedication;
            }

            if (
                responses.value &&
                responses.value.length > 0
            ) {
                payload.responses = responses.value.map((code) => ({ code }));
            }

            if (
                mutations.value &&
                mutations.value.length > 0
            ) {
                const mutationItems = mutations.value.map(
                    (item) => item.data,
                ).filter((item): item is QueryGeneAlterationCriteria<Coding> => item != null);
                if (mutationItems.length > 0) {
                    payload.geneAlterations = {
                        items: mutationItems,
                        operator: mutationsInCombination.value ?
                            LogicalOperator.AND :
                            LogicalOperator.OR,
                    };
                }
            }

            return payload;
        };

        expose({ reset });

        Promise.resolve()
            .then(() => reset());

        const save = () => {
            emit('save', buildCriteria());
        };

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;
            // await new Promise((resolve) => setTimeout(resolve, 10_000));

            try {
                const payload = buildCriteria();

                filterStore.reset();
                filterStore.resetActive();

                let query : QuerySession;

                if (props.queryId) {
                    query = await apiClient.query.update(props.queryId, {
                        criteria: payload,
                        mode: { code: mode.value },
                        sites: modeSites.value,
                    });

                    emit('updated', query);
                } else {
                    query = await apiClient.query.submit({
                        criteria: payload,
                        mode: { code: mode.value },
                        sites: modeSites.value,
                    });

                    emit('created', query);
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            } finally {
                busy.value = false;
            }
        };

        const transformCodings = (coding: ValueSetCoding) => ({
            value: coding.code,
            label: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        const handleMedicationUpdated = ({
            drugs,
            usage,
            combination,
        }: {
            drugs: Coding[];
            usage: string[];
            combination: boolean
        }) => {
            medicationDrugs.value = drugs;
            medicationUsage.value = usage;
            medicationInCombination.value = combination;
        };

        return {
            mutations,
            mutationsInCombination,

            diagnoses,
            tumorMorphologies,
            responses,

            mode,
            modeOptions,
            modeSites,

            medicationDrugs,
            medicationUsage,
            medicationInCombination,

            busy,

            expanded,
            toggleExpanded,

            save,
            submit,

            handleMedicationUpdated,

            transformCodings,
        };
    },
});
</script>
<template>
    <div>
        <form>
            <div class="mb-3">
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="mb-0">
                            <VCIcon name="fa6-solid:notes-medical" /> Diagnose
                        </h6>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleExpanded('diagnosis')"
                        >
                            <VCIcon :name="expanded.diagnosis ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </button>
                    </div>
                </div>
                <div
                    v-show="expanded.diagnosis"
                    class="row mt-2"
                >
                    <div class="col">
                        <VCFormGroup>
                            <template #default>
                                <DValueSet
                                    :code="'http://fhir.de/CodeSystem/bfarm/icd-10-gm'"
                                    :filter="['is-a-category']"
                                    :lazy-load="true"
                                >
                                    <template #default="{ data }">
                                        <DCollectionTransform
                                            :items="data.codings || []"
                                            :transform="transformCodings"
                                        >
                                            <template #default="options">
                                                <VCFormSelectSearch
                                                    v-model="diagnoses"
                                                    :options="options"
                                                    :close-on-select="true"
                                                    placeholder="ICD-10"
                                                />
                                            </template>
                                        </DCollectionTransform>
                                    </template>
                                    <template #loading>
                                        <VCFormSelectSearch
                                            :options="[]"
                                            :disabled="true"
                                            placeholder="ICD-10"
                                        />
                                    </template>
                                </DValueSet>
                            </template>
                        </VCFormGroup>
                    </div>
                    <div class="col">
                        <VCFormGroup>
                            <template #default>
                                <DValueSet
                                    :code="'urn:oid:2.16.840.1.113883.6.43.1'"
                                    :lazy-load="true"
                                    :filter="['morphology', 'is-a-category']"
                                >
                                    <template #default="{ data }">
                                        <DCollectionTransform
                                            :items="data.codings || []"
                                            :transform="transformCodings"
                                        >
                                            <template #default="options">
                                                <VCFormSelectSearch
                                                    v-model="tumorMorphologies"
                                                    :options="options"
                                                    :close-on-select="true"
                                                    placeholder="Tumormorphologie oder ICD-0-3-M"
                                                />
                                            </template>
                                        </DCollectionTransform>
                                    </template>
                                    <template #loading>
                                        <VCFormSelectSearch
                                            :options="[]"
                                            :disabled="true"
                                            placeholder="Tumormorphologie oder ICD-0-3-M"
                                        />
                                    </template>
                                </DValueSet>
                            </template>
                        </VCFormGroup>
                    </div>
                </div>
            </div>

            <hr>


            <div>
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="mb-0">
                            <VCIcon name="fa6-solid:dna" /> Alteration
                        </h6>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleExpanded('alteration')"
                        >
                            <VCIcon :name="expanded.alteration ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </button>
                    </div>
                </div>
                <div
                    v-show="expanded.alteration"
                    class="mt-2"
                >
                    <DFormTabGroups
                        v-model="mutations"
                        :min-items="1"
                        :max-items="6"
                    >
                        <template #default="props">
                            <MMutationTabGroup
                                :entity="props.data"
                                @saved="props.saved"
                            />
                        </template>
                    </DFormTabGroups>

                    <VCFormCheckbox
                        v-model="mutationsInCombination"
                        :group-class="'form-switch'"
                        :label="true"
                        :label-content="'In Kombination?'"
                    />
                </div>
            </div>

            <hr>

            <div>
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="mb-0">
                            <VCIcon name="fa6-solid:pills" /> Medikation
                        </h6>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleExpanded('medication')"
                        >
                            <VCIcon :name="expanded.medication ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </button>
                    </div>
                </div>
                <div
                    v-show="expanded.medication"
                    class="mt-2"
                >
                    <MSearchMedicationForm
                        :usage="medicationUsage"
                        :drugs="medicationDrugs"
                        :combination="medicationInCombination"
                        @updated="handleMedicationUpdated"
                    />
                </div>
            </div>

            <hr>

            <div class="mb-3">
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="mb-0">
                            <VCIcon name="fa6-solid:chart-line" /> Response
                        </h6>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleExpanded('response')"
                        >
                            <VCIcon :name="expanded.response ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </button>
                    </div>
                </div>
                <div
                    v-show="expanded.response"
                    class="row mt-2"
                >
                    <div class="col">
                        <VCFormGroup>
                            <template #default>
                                <DValueSet
                                    :code="'RECIST'"
                                    :lazy-load="true"
                                >
                                    <template #default="{ data }">
                                        <DCollectionTransform
                                            :items="data.codings || []"
                                            :transform="transformCodings"
                                        >
                                            <template #default="options">
                                                <VCFormSelectSearch
                                                    v-model="responses"
                                                    :options="options"
                                                    :close-on-select="true"
                                                    placeholder="RECIST"
                                                />
                                            </template>
                                        </DCollectionTransform>
                                    </template>
                                    <template #loading>
                                        <VCFormSelectSearch
                                            :options="[]"
                                            :disabled="true"
                                            placeholder="RECIST"
                                        />
                                    </template>
                                </DValueSet>
                            </template>
                        </VCFormGroup>
                    </div>
                </div>
            </div>

            <hr>

            <div>
                <div class="flex flex-row items-center">
                    <div>
                        <h6 class="mb-0">
                            <VCIcon name="fa6-solid:filter" /> Suchmodus
                        </h6>
                    </div>
                    <div class="ms-auto">
                        <button
                            type="button"
                            class="btn btn-dark btn-xs"
                            @click.prevent="toggleExpanded('mode')"
                        >
                            <VCIcon :name="expanded.mode ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                        </button>
                    </div>
                </div>
                <div
                    v-show="expanded.mode"
                    class="mt-2"
                >
                    <VCFormSelect
                        v-model="mode"
                        :options="modeOptions"
                        :option-default="false"
                    />

                    <template v-if="mode === 'custom'">
                        <DSitePicker
                            v-model="modeSites"
                            class="mt-3"
                            :use-case="'mtb'"
                        />
                    </template>
                </div>
            </div>

            <div
                class="sticky bottom-0 z-10 mt-4 flex flex-wrap items-center justify-end gap-2
                       border-t border-border bg-bg/85 py-3 backdrop-blur"
            >
                <button
                    :disabled="busy"
                    type="button"
                    class="btn btn-secondary"
                    title="Suchkriterien als gespeicherte Anfrage ablegen"
                    @click.prevent="save()"
                >
                    <VCIcon name="fa6-solid:floppy-disk" />
                    Speichern
                </button>

                <DLoadingButton
                    class="btn btn-primary min-w-36"
                    :loading="busy"
                    @click.prevent="submit()"
                >
                    <VCIcon
                        name="fa6-solid:magnifying-glass"
                        class="me-1"
                    /> Suchen
                </DLoadingButton>
            </div>
        </form>
        <DLoadingModal :display="busy" />
    </div>
</template>
