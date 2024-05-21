<script lang="ts">
import {
    DCollectionTransform,
    DFormTabGroups,
    DTags,
    DValueSet,
    QueryCriteriaOperator,
    QueryRequestMode,
    type ValueSetCoding,
    buildCodingsRecord,
    extractCodeFromCodingsRecord,
    transformCodingsToFormSelectOptions,
    transformFormSelectOptionsToCodings,
} from '@dnpm-dip/core';
import {
    VCFormSelectSearch,
} from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import { injectHTTPClient } from '../../core/http-client';
import {
    FormMutationType,
    type MutationDefinition,
    type QueryCNVCriteria,
    type QueryCriteria,
    type QueryFusionCriteria, type QueryMedicationCriteria,
    type QuerySNVCriteria,
} from '../../domains';
import MMutationTabGroup from './MMutationTabGroup.vue';

export default defineComponent({
    components: {
        MMutationTabGroup,
        DFormTabGroups,
        DTags,
        DValueSet,
        VCFormSelectSearch,
        DCollectionTransform,
    },
    props: {
        criteria: {
            type: Object as PropType<QueryCriteria>,
        },
        queryId: {
            type: String,
        },
        queryMode: {
            type: String as PropType<QueryRequestMode>,
        },
    },
    emits: [
        'failed',

        'preparedQueryCreated',
        'preparedQueryUpdated',

        'queryCreated',
        'queryUpdated',
    ],
    async setup(props, { emit, expose }) {
        const apiClient = injectHTTPClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeOptions : FormSelectOption[] = [
            { id: QueryRequestMode.LOCAL, value: 'Lokal' },
            { id: QueryRequestMode.FEDERATED, value: 'Föderiert' },
        ];

        const busy = ref(false);
        const criteria = ref<QueryCriteria>({});

        const mutations = ref<MutationDefinition[]>([]);

        const diagnoses = ref<FormSelectOption[]>([]);
        const tumorMorphologies = ref<FormSelectOption[]>([]);

        const medicationDrugs = ref<FormSelectOption[]>([]);
        const medicationUsage = ref<string[]>([]);
        const medicationOperator = ref<`${QueryCriteriaOperator}`>(QueryCriteriaOperator.OR);

        const responses = ref<FormSelectOption[]>([]);

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            criteria.value = {};

            if (props.criteria) {
                criteria.value = props.criteria;
            }

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            if (criteria.value.diagnoses) {
                diagnoses.value = transformCodingsToFormSelectOptions(criteria.value.diagnoses);
            }

            if (criteria.value.tumorMorphologies) {
                tumorMorphologies.value = transformCodingsToFormSelectOptions(criteria.value.tumorMorphologies);
            }

            if (criteria.value.medication) {
                if (criteria.value.medication.drugs) {
                    medicationDrugs.value = transformCodingsToFormSelectOptions(criteria.value.medication.drugs);
                }

                if (criteria.value.medication.usage) {
                    medicationDrugs.value = transformCodingsToFormSelectOptions(criteria.value.medication.usage);
                }

                if (criteria.value.medication.operator) {
                    medicationOperator.value = criteria.value.medication.operator;
                }
            }

            if (criteria.value.responses) {
                responses.value = transformCodingsToFormSelectOptions(criteria.value.responses);
            }

            mutations.value = [];

            if (criteria.value.simpleVariants) {
                for (let i = 0; i < criteria.value.simpleVariants.length; i++) {
                    mutations.value.push({
                        type: FormMutationType.SNV,
                        data: extractCodeFromCodingsRecord(criteria.value.simpleVariants[i]),
                    });
                }
            }

            if (criteria.value.copyNumberVariants) {
                for (let i = 0; i < criteria.value.copyNumberVariants.length; i++) {
                    mutations.value.push({
                        type: FormMutationType.CNV,
                        data: extractCodeFromCodingsRecord(criteria.value.copyNumberVariants[i]),
                    });
                }
            }

            if (criteria.value.dnaFusions) {
                for (let i = 0; i < criteria.value.dnaFusions.length; i++) {
                    mutations.value.push({
                        type: FormMutationType.DNA_FUSION,
                        data: extractCodeFromCodingsRecord(criteria.value.dnaFusions[i]),
                    });
                }
            }

            if (criteria.value.rnaFusions) {
                for (let i = 0; i < criteria.value.rnaFusions.length; i++) {
                    mutations.value.push({
                        type: FormMutationType.RNA_FUSION,
                        data: extractCodeFromCodingsRecord(criteria.value.rnaFusions[i]),
                    });
                }
            }

            busy.value = false;
        };

        const buildCriteria = () : QueryCriteria => {
            const payload : QueryCriteria = {};

            if (
                diagnoses.value &&
                diagnoses.value.length > 0
            ) {
                payload.diagnoses = transformFormSelectOptionsToCodings(diagnoses.value);
            }

            if (
                tumorMorphologies.value &&
                tumorMorphologies.value.length > 0
            ) {
                payload.tumorMorphologies = transformFormSelectOptionsToCodings(tumorMorphologies.value);
            }

            const medication : QueryMedicationCriteria = {};

            if (
                medicationDrugs.value &&
                medicationDrugs.value.length > 0
            ) {
                medication.drugs = transformFormSelectOptionsToCodings(medicationDrugs.value);
            }

            if (
                medicationUsage.value &&
                medicationUsage.value.length > 0
            ) {
                medication.usage = medicationUsage.value.map((item) => ({ code: item }));
            }

            if (medicationOperator.value) {
                medication.operator = medicationOperator.value;
            }

            if (medication.drugs) {
                payload.medication = medication;
            }

            if (
                responses.value &&
                responses.value.length > 0
            ) {
                payload.responses = transformFormSelectOptionsToCodings(responses.value);
            }

            const snv : QuerySNVCriteria[] = [];
            const cnv : QueryCNVCriteria[] = [];
            const dnaFusions : QueryFusionCriteria[] = [];
            const rnaFusions : QueryFusionCriteria[] = [];

            for (let i = 0; i < mutations.value.length; i++) {
                const mutation = mutations.value[i];

                switch (mutation.type) {
                    case FormMutationType.CNV: {
                        cnv.push(buildCodingsRecord(mutation.data));
                        break;
                    }
                    case FormMutationType.SNV: {
                        snv.push(buildCodingsRecord(mutation.data));
                        break;
                    }
                    case FormMutationType.DNA_FUSION: {
                        dnaFusions.push(buildCodingsRecord(mutation.data));
                        break;
                    }
                    case FormMutationType.RNA_FUSION: {
                        rnaFusions.push(buildCodingsRecord(mutation.data));
                        break;
                    }
                }
            }

            if (cnv.length > 0) {
                payload.copyNumberVariants = cnv;
            }

            if (snv.length > 0) {
                payload.simpleVariants = snv;
            }

            if (dnaFusions.length > 0) {
                payload.dnaFusions = dnaFusions;
            }

            if (rnaFusions.length > 0) {
                payload.rnaFusions = rnaFusions;
            }

            return payload;
        };

        expose({
            reset,
        });

        Promise.resolve()
            .then(() => reset());

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = buildCriteria();

            try {
                let query : any;

                if (props.queryId) {
                    query = await apiClient.query.update(props.queryId, {
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                    });

                    emit('queryUpdated', query);
                } else {
                    query = await apiClient.query.submit({
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                    });

                    emit('queryCreated', query);
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
            id: coding.code,
            value: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        return {
            mutations,
            diagnoses,
            tumorMorphologies,
            responses,

            mode,
            modeOptions,

            medicationDrugs,
            medicationUsage,
            medicationOperator,

            busy,

            submit,

            transformCodings,
        };
    },
});
</script>
<template>
    <div>
        <form>
            <div>
                <h6><i class="fa fa-dna" /> Alteration</h6>
                <DFormTabGroups
                    v-model="mutations"
                    :min-items="0"
                    :max-items="6"
                    :direction="'col'"
                >
                    <template #default="props">
                        <MMutationTabGroup
                            :entity="props.item"
                            @updated="props.updated"
                        />
                    </template>
                </DFormTabGroups>
            </div>

            <hr>

            <div class="row mb-3">
                <h6><i class="fa fa-diagnoses" /> Diagnose </h6>
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
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <VCFormSelectSearch
                                                v-model="diagnoses"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="ICD-10"
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DTags
                                                        :items="items"
                                                        tag-variant="dark"
                                                        @deleted="toggle"
                                                    />
                                                </template>
                                            </VCFormSelectSearch>
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
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <VCFormSelectSearch
                                                v-model="tumorMorphologies"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="Tumormorphologie oder ICD-0-3-M"
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DTags
                                                        :items="items"
                                                        tag-variant="dark"
                                                        @deleted="toggle"
                                                    />
                                                </template>
                                            </VCFormSelectSearch>
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

            <hr>

            <div class="row mb-3">
                <h6><i class="fas fa-chart-line" /> Response</h6>
                <div class="col">
                    <VCFormGroup>
                        <template #default>
                            <DValueSet
                                :code="'RECIST'"
                                :lazy-load="true"
                            >
                                <template #default="{ data }">
                                    <DCollectionTransform
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <VCFormSelectSearch
                                                v-model="responses"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="RECIST"
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DTags
                                                        :items="items"
                                                        tag-variant="dark"
                                                        @deleted="toggle"
                                                    />
                                                </template>
                                            </VCFormSelectSearch>
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

            <hr>

            <div class="mb-3">
                <h6><i class="fa fa-pills" /> Medikation</h6>
                <div class="d-flex flex-row">
                    <div>
                        <VCFormInputCheckbox
                            v-model="medicationUsage"
                            :value="'recommended'"
                            :label="true"
                            :group="true"
                        >
                            <template #label="{id}">
                                <label :for="id">Empfohlen?</label>
                            </template>
                        </VCFormInputCheckbox>
                    </div>
                    <div class="ms-3">
                        <VCFormInputCheckbox
                            v-model="medicationUsage"
                            :value="'used'"
                            :label="true"
                            :group="true"
                        >
                            <template #label="{id}">
                                <label :for="id">Verabreicht?</label>
                            </template>
                        </VCFormInputCheckbox>
                    </div>
                </div>
                <div>
                    <VCFormGroup>
                        <template #label>
                            Name
                        </template>
                        <template #default>
                            <DValueSet
                                :code="'http://fhir.de/CodeSystem/bfarm/atc'"
                                :lazy-load="true"
                            >
                                <template #default="{ data }">
                                    <DCollectionTransform
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <VCFormSelectSearch
                                                v-model="medicationDrugs"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="ATC"
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DCollectionTransform
                                                        :items="items"
                                                        :transform="(item: Record<string,any>) => ({
                                                            ...item,
                                                            value: item.value.split(':').pop()
                                                        })"
                                                    >
                                                        <template #default="tags">
                                                            <DTags
                                                                :items="tags"
                                                                tag-variant="dark"
                                                                @deleted="toggle"
                                                            />
                                                        </template>
                                                    </DCollectionTransform>
                                                </template>
                                            </VCFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <VCFormSelectSearch
                                        :options="[]"
                                        :disabled="true"
                                        placeholder="ATC"
                                    />
                                </template>
                            </DValueSet>
                        </template>
                    </VCFormGroup>
                </div>
            </div>

            <hr>

            <div>
                <h6><i class="fas fa-filter" /> Suchmodus</h6>

                <VCFormSelect
                    v-model="mode"
                    :options="modeOptions"
                    :option-default="false"
                />
            </div>

            <hr>

            <div>
                <div class="row">
                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-block btn-dark"
                            @click.prevent="submit()"
                        >
                            <i class="fa fa-search me-1" /> Suchen
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
