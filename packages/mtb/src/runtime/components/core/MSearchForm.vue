<script lang="ts">
import {
    type CodeSystemConcept,
    DCollectionTransform,
    DFormSelectSearch, DFormTabGroups,
    DTags,
    DValueSet,
    type ValueSetCoding,
} from '@dnpm-dip/core';
import {
    QueryRequestMode,
} from '@dnpm-dip/core';
import type { FormSelectOption } from '@vuecs/form-controls';
import type { PropType } from 'vue';
import {
    defineComponent, ref,
} from 'vue';
import { useMTBAPIClient } from '#imports';
import type { QueryCriteria } from '../../domains';
import MMutationTabGroup from './MMutationTabGroup.vue';

export default defineComponent({
    components: {
        MMutationTabGroup,
        DFormTabGroups,
        DTags,
        DValueSet,
        DFormSelectSearch,
        DCollectionTransform,
    },
    props: {
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
        const apiClient = useMTBAPIClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeOptions : FormSelectOption[] = [
            { id: QueryRequestMode.LOCAL, value: 'Lokal' },
            { id: QueryRequestMode.FEDERATED, value: 'Föderiert' },
        ];

        const busy = ref(false);
        const criteria = ref<QueryCriteria>({});

        const mutations = ref([]);
        const diagnoses = ref<FormSelectOption[]>([]);
        const tumorMorphologies = ref<FormSelectOption[]>([]);
        const responses = ref<FormSelectOption[]>([]);

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            criteria.value = {};

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            busy.value = false;
        };

        expose({
            reset,
        });

        Promise.resolve()
            .then(() => reset());

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = {};

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

        const transformConcepts = (concept: CodeSystemConcept) => ({
            id: concept.code,
            value: `${concept.properties.Symbol}: ${concept.display}`,
        });

        return {
            mutations,
            diagnoses,
            tumorMorphologies,
            responses,

            mode,
            modeOptions,

            busy,

            submit,

            transformCodings,
            transformConcepts,
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
                    :min-items="1"
                    :max-items="6"
                >
                    <template #default="props">
                        <MMutationTabGroup
                            :entity="props.entity"
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
                                :lazy-load="true"
                            >
                                <template #default="{ data }">
                                    <DCollectionTransform
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <DFormSelectSearch
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
                                            </DFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <DFormSelectSearch
                                        :options="[]"
                                        :disabled="true"
                                        placeholder="Orphanet Ontology"
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
                            >
                                <template #default="{ data }">
                                    <DCollectionTransform
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <DFormSelectSearch
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
                                            </DFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <DFormSelectSearch
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
                                            <DFormSelectSearch
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
                                            </DFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <DFormSelectSearch
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
            <div class="row mb-3">
                <h6><i class="fa fa-pills" /> Medikament</h6>
                <div class="col">
                    <VCFormGroup>
                        <template #label>
                            Verwendung
                        </template>
                        <template #default>
                            <DValueSet
                                :code="'dnpm-dip/mtb/query/medication-usage'"
                                :lazy-load="true"
                            >
                                <template #default="{ data }">
                                    <DCollectionTransform
                                        :items="data.codings"
                                        :transform="transformCodings"
                                    >
                                        <template #default="options">
                                            <DFormSelectSearch
                                                v-model="responses"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="..."
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DTags
                                                        :items="items"
                                                        tag-variant="dark"
                                                        @deleted="toggle"
                                                    />
                                                </template>
                                            </DFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <DFormSelectSearch
                                        :options="[]"
                                        :disabled="true"
                                        placeholder="Orphanet Ontology"
                                    />
                                </template>
                            </DValueSet>
                        </template>
                    </VCFormGroup>
                </div>
                <div class="col">
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
                                            <DFormSelectSearch
                                                v-model="responses"
                                                :multiple="true"
                                                :options="options"
                                                placeholder="..."
                                            >
                                                <template #selected="{ items, toggle }">
                                                    <DTags
                                                        :items="items"
                                                        tag-variant="dark"
                                                        @deleted="toggle"
                                                    />
                                                </template>
                                            </DFormSelectSearch>
                                        </template>
                                    </DCollectionTransform>
                                </template>
                                <template #loading>
                                    <DFormSelectSearch
                                        :options="[]"
                                        :disabled="true"
                                        placeholder="Orphanet Ontology"
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
