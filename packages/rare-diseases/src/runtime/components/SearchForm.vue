<script lang="ts">
import { FormInput, FormInputCheckbox, FormSelect } from '@vue-layout/form-controls';
import { defineComponent, reactive, ref } from 'vue';
import type { QueryRequestMode, ValueSetCoding } from '@dnpm-dip/core';
import { ValueSetEntity } from '@dnpm-dip/core';
import { useRDAPIClient } from '#imports';
import type { RDQueryCriteriaScopeValue, RDQueryCriteriaScopes } from '../domains';
import FormSelectSearch from './FormSelectSearch.vue';
import ValueSetCodings from './ValueSetCodings.vue';

export default defineComponent({
    components: {
        ValueSetCodings,
        FormInput,
        FormInputCheckbox,
        FormSelect,
        FormSelectSearch,
        ValueSetEntity,
    },
    emits: ['failed', 'created'],
    async setup(props, { emit }) {
        // todo: how to know the key of the query request body?
        const form = reactive({
            // hpoTerms
            hpo_term: '',

            // diagnosis
            category: '',

            // variants
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',

            // todo: what scope?!
            vital_status: '',
        });

        const apiClient = useRDAPIClient();

        const submit = async (mode: `${QueryRequestMode}`) => {
            let diagnoses : Record<string, RDQueryCriteriaScopeValue> | undefined;
            let hpoTerms : RDQueryCriteriaScopeValue | undefined;
            let variants : Record<string, RDQueryCriteriaScopeValue> | undefined;

            const keys = Object.keys(form);
            for (let i = 0; i < keys.length; i++) {
                if (form[keys[i]].length === 0) {
                    continue;
                }

                switch (keys[i]) {
                    case 'hpo_term': {
                        hpoTerms = {
                            code: form.hpo_term,
                        };
                        break;
                    }
                    case 'category': {
                        diagnoses = {
                            category: {
                                code: form.category,
                            },
                        };
                        break;
                    }
                    case 'vital_status': {
                        break;
                    }
                    default: {
                        if (typeof variants === 'undefined') {
                            variants = {};
                        }
                        variants[keys[i]] = {
                            code: form[keys[i]] as string,
                        };
                        break;
                    }
                }
            }

            const criteria : RDQueryCriteriaScopes = {};
            if (diagnoses) {
                criteria.diagnoses = [diagnoses];
            }
            if (hpoTerms) {
                criteria.hpoTerms = [hpoTerms];
            }
            if (variants) {
                criteria.variants = [variants];
            }

            try {
                const data = await apiClient.query.submit({
                    criteria,
                    mode,
                });

                emit('created', data);
            } catch (e) {
                if (e instanceof Error) {
                    emit('failed', e);
                }
            }
        };

        const transformCodingsForSelect = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display,
        });

        return {
            form,
            submit,
            transformCodingsForSelect,
        };
    },
});
</script>
<template>
    <div>
        <form @submit.prevent="submit">
            <div class="row mb-2">
                <div class="col">
                    <h6>Diagnoses</h6>
                    <ValueSetEntity
                        :code="'https://www.orpha.net'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Category</label>
                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="form.category"
                                            :options="options"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                        <template #loading>
                            <div class="form-group">
                                <label>Category</label>
                                <FormSelectSearch
                                    :options="[]"
                                />
                            </div>
                        </template>
                    </ValueSetEntity>
                </div>
                <div class="col">
                    <h6>HPO</h6>

                    <ValueSetEntity
                        :code="'https://hpo.jax.org'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Terms</label>
                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="form.hpo_term"
                                            :options="options"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                        <template #loading>
                            <div class="form-group">
                                <label>Terms</label>
                                <FormSelectSearch
                                    :options="[]"
                                />
                            </div>
                        </template>
                    </ValueSetEntity>
                </div>
            </div>
            <hr>
            <div class="row mb-2">
                <div class="col">
                    <h6>Variant</h6>

                    <ValueSetEntity
                        :code="'https://www.genenames.org/'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Gene</label>
                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            v-model="form.gene"
                                            :options="options"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                        <template #loading>
                            <div class="form-group">
                                <label>Gene</label>
                                <FormSelectSearch
                                    :options="[]"
                                />
                            </div>
                        </template>
                    </ValueSetEntity>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <FormInputCheckbox
                    v-model="federated"
                    :label="true"
                    :label-content="'Federated?'"
                />
                <div class="alert alert-sm alert-info">
                    If this option is enabled, the search will be federated across all sites instead of just the local site.
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <button
                            type="button"
                            class="btn btn-sm btn-block btn-primary"
                            @click.prevent="submit('local')"
                        >
                            <i class="fa fa-play me-1" /> Local
                        </button>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <button
                            type="button"
                            class="btn btn-sm btn-block btn-primary"
                            @click.prevent="submit('federated')"
                        >
                            <i class="fa fa-play me-1" /> Federated
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
