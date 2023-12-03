<script lang="ts">
import type { CodeRecord, CodeSystemConcept, ValueSetCoding } from '@dnpm-dip/core';
import { CodeSystemEntity, QueryRequestMode, ValueSetEntity } from '@dnpm-dip/core';
import type { FormSelectOption } from '@vue-layout/form-controls';
import { VCFormGroup, VCFormInput } from '@vue-layout/form-controls';
import type { PropType } from 'vue';
import {
    defineComponent, reactive, ref,
} from 'vue';
import { useRDAPIClient } from '#imports';
import type {
    RDPreparedQuery,
    RDQueryCriteria,
    RDQueryCriteriaVariant,
    RDQuerySession,
    RDVariantCriteria,
} from '../../domains';
import CollectionTransform from '../utility/CollectionTransform.vue';
import FormSelectSearch from '../utility/FormSelectSearch.vue';
import Tags from '../utility/Tags.vue';

export default defineComponent({
    components: {
        Tags,
        CollectionTransform,
        VCFormGroup,
        VCFormInput,
        FormSelectSearch,
        CodeSystemEntity,
        ValueSetEntity,
    },
    props: {
        criteria: {
            type: Object as PropType<RDQueryCriteria>,
        },
        queryId: {
            type: String,
        },
        queryMode: {
            type: String as PropType<QueryRequestMode>,
        },
        preparedQuery: {
            type: Object as PropType<RDPreparedQuery>,
        },
        preparedQueryId: {
            type: String,
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
        const apiClient = useRDAPIClient();

        const mode = ref<QueryRequestMode>(QueryRequestMode.FEDERATED);
        const modeOptions : FormSelectOption[] = [
            { id: QueryRequestMode.LOCAL, value: 'Lokal' },
            { id: QueryRequestMode.FEDERATED, value: 'Föderiert' },
        ];

        const busy = ref(false);
        const criteria = ref<RDQueryCriteria>({});

        const categories = ref<FormSelectOption[]>([]);
        const hpoTerms = ref<FormSelectOption[]>([]);

        const variants = reactive<RDQueryCriteriaVariant<string>>({
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',
        });

        const preparedQueryId = ref<string | undefined>(undefined);
        const preparedQueryName = ref('');

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            criteria.value = {};
            categories.value = [];
            hpoTerms.value = [];

            variants.gene = '';
            variants.cDNAChange = '';
            variants.gDNAChange = '';
            variants.proteinChange = '';

            preparedQueryId.value = undefined;
            preparedQueryName.value = '';

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            try {
                if (props.criteria) {
                    criteria.value = props.criteria;
                }

                if (props.preparedQuery) {
                    preparedQueryId.value = props.preparedQuery.id;
                    preparedQueryName.value = props.preparedQuery.name;
                    if (!props.criteria) {
                        criteria.value = props.preparedQuery.criteria;
                    }
                } else if (props.preparedQueryId) {
                    const response = await apiClient.preparedQuery.getOne(props.preparedQueryId);
                    if (!props.criteria) {
                        criteria.value = response.criteria;
                    }

                    preparedQueryId.value = props.preparedQueryId;
                    preparedQueryName.value = response.name;
                } else if (props.queryId) {
                    const response = await apiClient.query.getOne(props.queryId);
                    criteria.value = response.criteria;
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed');
                }

                return;
            }

            if (
                criteria.value.variants &&
              criteria.value.variants.length > 0
            ) {
                const keys = Object.keys(criteria.value.variants[0]) as RDVariantCriteria[];
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    variants[key] = (criteria.value.variants[0] as RDQueryCriteriaVariant)[key]?.code;
                }
            }

            if (criteria.value.hpoTerms) {
                for (let i = 0; i < criteria.value.hpoTerms.length; i++) {
                    hpoTerms.value.push({
                        id: criteria.value.hpoTerms[i].code,
                        value: criteria.value.hpoTerms[i].display || criteria.value.hpoTerms[i].code,
                    });
                }
            }

            if (criteria.value.diagnoses) {
                for (let i = 0; i < criteria.value.diagnoses.length; i++) {
                    categories.value.push({
                        id: criteria.value.diagnoses[i].code,
                        value: criteria.value.diagnoses[i].display || criteria.value.diagnoses[i].code,
                    });
                }
            }

            busy.value = false;
        };

        expose({
            reset,
        });

        Promise.resolve()
            .then(() => reset());

        const selectCategory = (item: FormSelectOption) => {
            const index = categories.value.findIndex((el) => el.id === item.id);
            if (index === -1) {
                categories.value.push(item);
            } else {
                categories.value.splice(index, 1);
            }
        };

        const selectHPOTerm = (item: FormSelectOption) => {
            const index = hpoTerms.value.findIndex((el) => el.id === item.id);
            if (index === -1) {
                hpoTerms.value.push(item);
            } else {
                hpoTerms.value.splice(index, 1);
            }
        };

        const buildCriteria = () : RDQueryCriteria => {
            const payload : RDQueryCriteria = {};
            const keys = Object.keys(variants);
            if (keys.length > 0) {
                let isValid = false;
                const group : Record<string, CodeRecord> = {};
                for (let i = 0; i < keys.length; i++) {
                    const code = variants[keys[i] as keyof typeof variants];
                    if (code && code.length > 0) {
                        group[keys[i]] = {
                            code,
                        };
                        isValid = true;
                    }
                }

                if (isValid) {
                    payload.variants = [group];
                }
            }

            if (hpoTerms.value.length > 0) {
                payload.hpoTerms = [];

                for (let i = 0; i < hpoTerms.value.length; i++) {
                    payload.hpoTerms.push({
                        code: `${hpoTerms.value[i].id}`,
                    });
                }
            }

            if (categories.value.length > 0) {
                payload.diagnoses = [];

                for (let i = 0; i < categories.value.length; i++) {
                    payload.diagnoses.push({
                        code: `${categories.value[i].id}`,
                    });
                }
            }

            return payload;
        };

        const save = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = buildCriteria();

            try {
                let preparedQuery : RDPreparedQuery | undefined;

                if (preparedQueryId.value) {
                    preparedQuery = await apiClient.preparedQuery.update(
                        preparedQueryId.value,
                        {
                            name: preparedQueryName.value,
                            criteria: payload,
                        },
                    );

                    emit('preparedQueryUpdated', preparedQuery);
                } else {
                    preparedQuery = await apiClient.preparedQuery.create({
                        name: preparedQueryName.value,
                        criteria: payload,
                    });

                    preparedQueryId.value = preparedQuery.id;

                    emit('preparedQueryCreated', preparedQuery);
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            } finally {
                busy.value = false;
            }
        };

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = buildCriteria();

            try {
                let query : RDQuerySession;

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
            mode,
            modeOptions,

            busy,
            hpoTerms,
            categories,

            selectCategory,
            selectHPOTerm,

            form: variants,
            save,
            submit,

            transformCodings,
            transformConcepts,

            preparedQueryId,
            preparedQueryName,
        };
    },
});
</script>
<template>
    <div>
        <form>
            <div class="row mb-3">
                <div class="col">
                    <h6>Diagnose</h6>

                    <div class="form-group">
                        <label>Kategorie</label>
                        <ValueSetEntity
                            :code="'https://www.orpha.net'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <CollectionTransform
                                    :items="data.codings"
                                    :transform="transformCodings"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="categories"
                                            :multiple="true"
                                            :options="options"
                                            placeholder="Orphanet Ontology"
                                        >
                                            <template #selected="{ items, toggle }">
                                                <Tags
                                                    :items="items"
                                                    tag-variant="dark"
                                                    @deleted="toggle"
                                                />
                                            </template>
                                        </FormSelectSearch>
                                    </template>
                                </CollectionTransform>
                            </template>
                            <template #loading>
                                <FormSelectSearch
                                    :options="[]"
                                    :disabled="true"
                                    placeholder="Orphanet Ontology"
                                />
                            </template>
                        </ValueSetEntity>
                    </div>
                </div>
                <div class="col">
                    <h6>HPO</h6>

                    <div class="form-group">
                        <label>Term</label>
                        <ValueSetEntity
                            :code="'https://hpo.jax.org'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <CollectionTransform
                                    :items="data.codings"
                                    :transform="transformCodings"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="hpoTerms"
                                            :multiple="true"
                                            :options="options"
                                            placeholder="Human Phenotype Ontology"
                                        >
                                            <template #selected="{ items, toggle }">
                                                <Tags
                                                    :items="items"
                                                    tag-variant="dark"
                                                    @deleted="toggle"
                                                />
                                            </template>
                                        </FormSelectSearch>
                                    </template>
                                </CollectionTransform>
                            </template>
                            <template #loading>
                                <FormSelectSearch
                                    :disabled="true"
                                    :options="[]"
                                    placeholder="Human Phenotype Ontology"
                                />
                            </template>
                        </ValueSetEntity>
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <h6>Variante</h6>

                    <div class="form-group">
                        <label>Gene</label>
                        <CodeSystemEntity
                            :code="'https://www.genenames.org/'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <CollectionTransform
                                    :items="data.concepts"
                                    :transform="transformConcepts"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="form.gene"
                                            :options="options"
                                            placeholder="HGNC"
                                        />
                                    </template>
                                </CollectionTransform>
                            </template>
                            <template #loading>
                                <FormSelectSearch
                                    :disabled="true"
                                    :options="[]"
                                    placeholder="HGNC"
                                />
                            </template>
                        </CodeSystemEntity>
                    </div>
                </div>
                <div>
                    <VCFormGroup>
                        <label>kodierende DNA-Änderung</label>
                        <VCFormInput
                            v-model="form.cDNAChange"
                            placeholder="HGVS"
                        />
                    </VCFormGroup>
                    <VCFormGroup>
                        <label>genomische DNA-Änderung</label>
                        <VCFormInput
                            v-model="form.gDNAChange"
                            placeholder="HGVS"
                        />
                    </VCFormGroup>
                    <VCFormGroup>
                        <label>Proteinänderung</label>
                        <VCFormInput
                            v-model="form.proteinChange"
                            :disabled="busy"
                            placeholder="HGVS"
                        />
                    </VCFormGroup>
                </div>
            </div>

            <hr>

            <div>
                <h6>Suchmodus</h6>

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

                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-block btn-primary"
                            @click.prevent="save()"
                        >
                            <i class="fa fa-save me-1" /> {{ preparedQueryId ? 'Aktualisieren' : 'Speichern' }}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
