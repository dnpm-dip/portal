<script lang="ts">
import type { CodeRecord } from '@dnpm-dip/core/src';
import type { FormSelectOption } from '@vue-layout/form-controls';
import { FormInput } from '@vue-layout/form-controls';
import { defineComponent, reactive, ref } from 'vue';
import type { QueryRequestMode, ValueSetCoding } from '@dnpm-dip/core';
import { ValueSetEntity } from '@dnpm-dip/core';
import { useRDAPIClient } from '#imports';
import type { RDQueryCriteria, RDQueryCriteriaScopeValue } from '../domains';
import FormSelectSearch from './FormSelectSearch.vue';
import Tags from './Tags.vue';
import ValueSetCodings from './ValueSetCodings.vue';

export default defineComponent({
    components: {
        Tags,
        ValueSetCodings,
        FormInput,
        FormSelectSearch,
        ValueSetEntity,
    },
    emits: ['failed', 'created'],
    async setup(props, { emit }) {
        const categories = ref<FormSelectOption[]>([]);
        const hpoTerms = ref<FormSelectOption[]>([]);

        const selectCategory = (item: FormSelectOption) => {
            const index = categories.value.findIndex((el) => el.id === item.id);
            if (index === -1) {
                categories.value.push(item);
            }
        };

        const selectHPOTerm = (item: FormSelectOption) => {
            const index = hpoTerms.value.findIndex((el) => el.id === item.id);
            if (index === -1) {
                hpoTerms.value.push(item);
            }
        };

        const variants = reactive({
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',
        });

        const apiClient = useRDAPIClient();

        const submit = async (mode: `${QueryRequestMode}`) => {
            const criteria : RDQueryCriteria = {};
            const keys = Object.keys(variants);
            if (keys.length > 0) {
                let isValid = false;
                const group : Record<string, CodeRecord> = {};
                for (let i = 0; i < keys.length; i++) {
                    const code = variants[keys[i] as keyof typeof variants];
                    if (code.length > 0) {
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
                const data = await apiClient.query.submit({
                    criteria,
                    mode: {
                        code: mode,
                    },
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
            hpoTerms,
            categories,

            selectCategory,
            selectHPOTerm,

            form: variants,
            submit,
            transformCodingsForSelect,
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
                    <ValueSetEntity
                        :code="'https://www.orpha.net'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Kategorie</label>
                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            :options="options"
                                            @changed="selectCategory"
                                        />
                                    </template>
                                </ValueSetCodings>
                            </div>
                        </template>
                        <template #loading>
                            <div class="form-group">
                                <label>Kategorie</label>
                                <FormSelectSearch
                                    :options="[]"
                                />
                            </div>
                        </template>
                    </ValueSetEntity>

                    <Tags
                        v-model="categories"
                        tag-variant="dark"
                    />
                </div>
                <div class="col">
                    <h6>HPO</h6>

                    <ValueSetEntity
                        :code="'https://hpo.jax.org'"
                        :lazy-load="true"
                    >
                        <template #default="{ data }">
                            <div class="form-group">
                                <label>Term</label>
                                <ValueSetCodings
                                    :entity="data"
                                    :transform="transformCodingsForSelect"
                                >
                                    <template #default="options">
                                        <FormSelectSearch
                                            :options="options"
                                            @changed="selectHPOTerm"
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

                    <Tags
                        v-model="hpoTerms"
                        tag-variant="dark"
                    />
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <h6>Variante</h6>

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
                <div>
                    <FormInput
                        :label="true"
                        :label-content="'kodierende DNA-Änderung'"
                        placeholder="..."
                    />
                    <FormInput
                        :label="true"
                        :label-content="'genomische DNA-Änderung'"
                        placeholder="..."
                    />
                    <FormInput
                        :label="true"
                        :label-content="'Proteinänderung'"
                        placeholder="..."
                    />
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <button
                            type="button"
                            class="btn btn-sm btn-block btn-dark"
                            @click.prevent="submit('local')"
                        >
                            Lokal
                        </button>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <button
                            type="button"
                            class="btn btn-sm btn-block btn-dark"
                            @click.prevent="submit('federated')"
                        >
                            Förderiert
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
