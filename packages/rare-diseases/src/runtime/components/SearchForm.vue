<script lang="ts">
import { FormInput, FormSelect } from '@vue-layout/form-controls';
import { defineComponent, reactive } from 'vue';
import type { ValueSetCoding } from '@dnpm-dip/core';
import { ValueSetEntity } from '@dnpm-dip/core';
import { useRDAPIClient } from '#imports';
import type { RDQueryCriteriaScopeValue, RDQueryCriteriaScopes } from '../domains/query';
import FormSelectSearch from './FormSelectSearch.vue';
import ValueSetCodings from './ValueSetCodings.vue';

export default defineComponent({
    components: {
        ValueSetCodings,
        FormInput,
        FormSelect,
        FormSelectSearch,
        ValueSetEntity,
    },
    emits: ['failed', 'created'],
    async setup(props, { emit }) {
        // todo: how to know what is a hpo, diagnosis or variant scope ?

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

        const submit = async () => {
            let diagnosis : Record<string, RDQueryCriteriaScopeValue> | undefined;
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
                        diagnosis = {
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
            if (diagnosis) {
                criteria.diagnosis = [diagnosis];
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
                    <h6>HPO</h6>

                    <FormInput
                        v-model="form.hpo_term"
                        :label="true"
                        :label-content="'Term'"
                        placeholder="..."
                    />
                </div>
                <div class="col">
                    <h6>Diagnosis</h6>
                    <ValueSetEntity :code="'dnpm-dip/rd/diagnosis/category'">
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Category</label>

                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelect
                                            v-model="form.category"
                                            :options="options"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                    </ValueSetEntity>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <h6>Variant</h6>

                    <ValueSetEntity :code="'https://www.genenames.org/'">
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
                    </ValueSetEntity>
                </div>
            </div>
            <div class="row">
                <h6>Others</h6>
                <div class="col">
                    <ValueSetEntity :code="'dnpm-dip/patient/vital-status'">
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Status</label>

                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelect
                                            v-model="form.vital_status"
                                            :options="options"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                    </ValueSetEntity>
                </div>
            </div>
            <div class="form-group">
                <button
                    type="button"
                    class="btn btn-xs btn-primary"
                    @click.prevent="submit"
                >
                    <i class="fa fa-search" /> Search
                </button>
            </div>
        </form>
    </div>
</template>
