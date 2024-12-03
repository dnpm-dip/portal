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
    DCollectionTransform,
    DFormTabGroups,
    DSitePicker,
    DTags,
    DValueSet,
    LogicalOperator,
    QueryRequestMode,
    type ValueSetCoding,
    transformCodingsToFormSelectOptions,
    transformFormSelectOptionsToCodings, useQueryFilterStore,
} from '@dnpm-dip/core';
import DFormTabGroup from '@dnpm-dip/core/components/utility/form-tab/DFormTabGroup.vue';
import {
    VCFormSelectSearch,
} from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import { injectHTTPClient } from '../../../core/http-client';
import {
    type QueryCriteria,
    type QueryGeneAlterationCriteria,
    type QueryMedicationCriteria,
} from '../../../domains';
import MMutationTabGroup from '../MMutationTabGroup.vue';
import MSearchMedicationForm from './MSearchMedicationForm.vue';

export default defineComponent({
    components: {
        DFormTabGroup,
        DSitePicker,
        MSearchMedicationForm,
        MMutationTabGroup,
        DFormTabGroups,
        DTags,
        DValueSet,
        VCFormSelectSearch,
        DCollectionTransform,
    },
    props: {
        criteria: {
            type: Object as PropType<QueryCriteria | null>,
        },
        queryId: {
            type: String,
        },
        queryMode: {
            type: String as PropType<QueryRequestMode>,
        },
        queryPeers: {
            type: Array as PropType<ConnectionPeer[]>,
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
        const filterStore = useQueryFilterStore();
        const apiClient = injectHTTPClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeSites = ref<Coding[]>([]);
        const modeOptions : FormSelectOption[] = [
            { id: QueryRequestMode.LOCAL, value: 'Lokal' },
            { id: QueryRequestMode.FEDERATED, value: 'Föderiert' },
            { id: QueryRequestMode.CUSTOM, value: 'Benutzerdefiniert' },
        ];

        const busy = ref(false);
        const criteria = ref<QueryCriteria>({});

        const mutations = ref<QueryGeneAlterationCriteria[]>([]);
        const mutationsInCombination = ref(false);

        const diagnoses = ref<FormSelectOption[]>([]);
        const tumorMorphologies = ref<FormSelectOption[]>([]);

        const medicationDrugs = ref<Coding[]>([]);
        const medicationUsage = ref<string[]>([]);
        const medicationInCombination = ref(false);

        const responses = ref<FormSelectOption[]>([]);

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            if (props.queryPeers) {
                modeSites.value = props.queryPeers.map((peer) => peer.site);
            }

            criteria.value = {};

            if (props.criteria) {
                criteria.value = props.criteria;
            }

            if (criteria.value.diagnoses) {
                diagnoses.value = transformCodingsToFormSelectOptions(criteria.value.diagnoses);
            }

            if (criteria.value.tumorMorphologies) {
                tumorMorphologies.value = transformCodingsToFormSelectOptions(criteria.value.tumorMorphologies);
            }

            if (criteria.value.medication) {
                if (criteria.value.medication.drugs) {
                    medicationDrugs.value = criteria.value.medication.drugs;
                }

                if (criteria.value.medication.usage) {
                    medicationUsage.value = criteria.value.medication.usage.map((e) => e.code);
                }

                if (criteria.value.medication.operator) {
                    medicationInCombination.value = criteria.value.medication.operator === LogicalOperator.AND;
                }
            }

            if (criteria.value.responses) {
                responses.value = transformCodingsToFormSelectOptions(criteria.value.responses);
            }

            mutations.value = [];

            if (
                criteria.value.geneAlterations &&
                criteria.value.geneAlterations.items &&
                criteria.value.geneAlterations.items.length > 0
            ) {
                mutations.value = criteria.value.geneAlterations.items;

                if (criteria.value.geneAlterations.operator) {
                    mutationsInCombination.value = criteria.value.geneAlterations.operator === LogicalOperator.AND;
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

            const payloadMedication : QueryMedicationCriteria = {};

            if (
                medicationDrugs.value &&
                medicationDrugs.value.length > 0
            ) {
                payloadMedication.drugs = medicationDrugs.value;
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

            if (payloadMedication.drugs) {
                payload.medication = payloadMedication;
            }

            if (
                responses.value &&
                responses.value.length > 0
            ) {
                payload.responses = transformFormSelectOptionsToCodings(responses.value);
            }

            if (
                mutations.value &&
                mutations.value.length > 0
            ) {
                payload.geneAlterations = {
                    items: mutations.value,
                    operator: mutationsInCombination.value ?
                        LogicalOperator.AND :
                        LogicalOperator.OR,
                };
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

            try {
                const payload = buildCriteria();

                filterStore.reset();
                filterStore.resetActive();

                let query : any;

                if (props.queryId) {
                    query = await apiClient.query.update(props.queryId, {
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                        sites: modeSites.value,
                    });

                    emit('queryUpdated', query);
                } else {
                    query = await apiClient.query.submit({
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                        sites: modeSites.value,
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

        const handleMedicationUpdated = ({ drugs, usage, combination }) => {
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
            <div>
                <h6><i class="fa fa-dna" /> Alteration</h6>
                <VCFormInputCheckbox
                    v-model="mutationsInCombination"
                    :group-class="'form-switch'"
                    :label="true"
                    :label-content="'In Kombination?'"
                />

                <DFormTabGroups
                    v-model="mutations"
                    :min-items="0"
                    :max-items="6"
                    :direction="'col'"
                >
                    <template #label="props">
                        <DFormTabGroup
                            :label="props.label"
                            :item="props.item"
                            :index="props.index"
                            :current-index="props.currentIndex"
                            @toggle="props.toggle"
                        >
                            <template v-if="props.item && props.item.type">
                                <template v-if="props.item.type === 'rnaFusion'">
                                    {{ props.index + 1 }}. RNA Fusion
                                </template>
                                <template v-else-if="props.item.type === 'dnaFusion'">
                                    {{ props.index + 1 }}. DNA Fusion
                                </template>
                                <template v-else>
                                    {{ props.index + 1 }}. {{ props.item.type.toUpperCase() }}
                                </template>
                            </template>
                            <template v-else>
                                {{ props.index + 1 }}
                            </template>
                        </DFormTabGroup>
                    </template>
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
                                                        :emit-only="true"
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
                                                        :emit-only="true"
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

            <MSearchMedicationForm
                :usage="medicationUsage"
                :drugs="medicationDrugs"
                :combination="medicationInCombination"
                @updated="handleMedicationUpdated"
            />

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
                                                        :emit-only="true"
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

            <div>
                <h6><i class="fas fa-filter" /> Suchmodus</h6>

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
