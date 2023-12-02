<script lang="ts">
import type {
    CodeRecord, CodeSystemConcept, QueryRequestMode, ValueSetCoding,
} from '@dnpm-dip/core';
import type { FormSelectOption } from '@vue-layout/form-controls';
import { VCFormGroup, VCFormInput } from '@vue-layout/form-controls';
import type { PropType } from 'vue';
import { defineComponent, reactive, ref } from 'vue';
import { CodeSystemEntity, ValueSetEntity, createResourceRecordManager } from '@dnpm-dip/core';
import { useRDAPIClient } from '#imports';
import type {
    RDQueryCriteria,
    RDQueryCriteriaVariant,
    RDQuerySession,
    RDVariantCriteria,
} from '../../domains';
import FormSelectSearch from '../utility/FormSelectSearch.vue';
import Tags from '../utility/Tags.vue';
import CollectionTransform from '../utility/CollectionTransform.vue';

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
        entity: {
            type: Object as PropType<RDQuerySession>,
        },
        entityId: {
            type: String,
        },
    },
    emits: ['failed', 'created', 'updated'],
    async setup(props, { emit }) {
        const apiClient = useRDAPIClient();

        const manager = createResourceRecordManager<RDQuerySession>({
            data: props.entity,
            async load() {
                if (props.entityId) {
                    return apiClient.query.getOne(props.entityId);
                }

                return undefined;
            },
        });

        const categories = ref<FormSelectOption[]>([]);
        const hpoTerms = ref<FormSelectOption[]>([]);

        const variants = reactive<RDQueryCriteriaVariant<string>>({
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',
        });

        const parse = () => {
            if (!manager.data.value || !manager.data.value.criteria) {
                return;
            }

            const criteria = manager.data.value?.criteria;
            if (
                criteria?.variants &&
                criteria.variants.length > 0
            ) {
                const keys = Object.keys(criteria.variants[0]) as RDVariantCriteria[];
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    variants[key] = (criteria.variants[0] as RDQueryCriteriaVariant)[key]?.code;
                }
            }

            if (criteria?.hpoTerms) {
                for (let i = 0; i < criteria.hpoTerms.length; i++) {
                    hpoTerms.value.push({
                        id: criteria.hpoTerms[i].code,
                        value: criteria.hpoTerms[i].display || criteria.hpoTerms[i].code,
                    });
                }
            }

            if (criteria?.diagnoses) {
                for (let i = 0; i < criteria.diagnoses.length; i++) {
                    categories.value.push({
                        id: criteria.diagnoses[i].code,
                        value: criteria.diagnoses[i].display || criteria.diagnoses[i].code,
                    });
                }
            }
        };

        Promise.resolve()
            .then(() => manager.load())
            .then(() => parse());

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

        const submit = async (mode: `${QueryRequestMode}`) => {
            if (manager.busy.value) return;

            manager.busy.value = true;

            const criteria : RDQueryCriteria = {};
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
                    criteria.variants = [group];
                }
            }

            if (hpoTerms.value.length > 0) {
                criteria.hpoTerms = [];

                for (let i = 0; i < hpoTerms.value.length; i++) {
                    criteria.hpoTerms.push({
                        code: `${hpoTerms.value[i].id}`,
                    });
                }
            }

            if (categories.value.length > 0) {
                criteria.diagnoses = [];

                for (let i = 0; i < categories.value.length; i++) {
                    criteria.diagnoses.push({
                        code: `${categories.value[i].id}`,
                    });
                }
            }

            try {
                let data : RDQuerySession;

                if (manager.data.value) {
                    data = await apiClient.query.update(manager.data.value.id, {
                        criteria,
                        mode: {
                            code: mode,
                        },
                    });

                    emit('created', data);
                } else {
                    data = await apiClient.query.submit({
                        criteria,
                        mode: {
                            code: mode,
                        },
                    });

                    emit('created', data);
                }
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            } finally {
                manager.busy.value = false;
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
            busy: manager.busy,
            hpoTerms,
            categories,

            selectCategory,
            selectHPOTerm,

            form: variants,
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
                            placeholder="HGVS"
                        />
                    </VCFormGroup>
                </div>
            </div>

            <div>
                <h6>Suchmodus</h6>
                <div class="row">
                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-sm btn-block btn-dark"
                            @click.prevent="submit('local')"
                        >
                            Lokal
                        </button>
                    </div>
                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-sm btn-block btn-dark"
                            @click.prevent="submit('federated')"
                        >
                            Föderiert
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
