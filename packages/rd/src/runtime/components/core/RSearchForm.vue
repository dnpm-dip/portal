<script lang="ts">
import type {
    CodeRecord,
    Coding,
    ConnectionPeer,
    FormTabInput,
    ValueSetCoding,
} from '@dnpm-dip/core';
import {
    DCollectionTransform,
    DFormTabGroups,
    DSitePicker, DTags, DValueSet, QueryRequestMode, useQueryFilterStore,
} from '@dnpm-dip/core';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import { type PropType, toRef, watch } from 'vue';
import {
    defineComponent, ref,
} from 'vue';
import { injectHTTPClient } from '../../core';
import type {
    QueryCriteria,
    QueryCriteriaVariant,
    QuerySession,
} from '../../domains';
import RVariantFormTabGroup from './RVariantFormTabGroup.vue';

export default defineComponent({
    components: {
        DSitePicker,
        DTags,
        RVariantFormTabGroup,
        DFormTabGroups,
        DCollectionTransform,
        VCFormSelectSearch,
        DValueSet,
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

        'created',
        'updated',

        'save',
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
        const criteria = toRef(props, 'criteria');

        const categories = ref<FormSelectOption[]>([]);
        const hpoTerms = ref<FormSelectOption[]>([]);

        const variants = ref<FormTabInput<QueryCriteriaVariant<string>>[]>([]);

        const parseCategory = (coding: Coding) => ({
            id: `${coding.system}:::${coding.code}`,
            value: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            criteria.value = {};
            categories.value = [];
            hpoTerms.value = [];

            variants.value = [];

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            if (props.queryPeers) {
                modeSites.value = props.queryPeers.map((peer) => peer.site);
            }

            if (props.criteria) {
                criteria.value = props.criteria;
            }

            if (criteria.value) {
                if (criteria.value.variants) {
                    for (let i = 0; i < criteria.value.variants.length; i++) {
                        const variant = criteria.value.variants[i] as QueryCriteriaVariant;
                        const data: QueryCriteriaVariant<string> = {};

                        const keys = Object.keys(variant);
                        for (let j = 0; j < keys.length; j++) {
                            data[keys[j] as keyof typeof data] = variant[keys[j] as keyof QueryCriteriaVariant]?.code;
                        }

                        variants.value.push(data.map((item) => ({
                            data: item,
                        })));
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
                        categories.value.push(parseCategory(criteria.value.diagnoses[i]));
                    }
                }
            }

            busy.value = false;
        };

        watch(criteria, (oldVal, newVal) => {
            if (oldVal === newVal) {
                return;
            }

            reset();
        });

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

        const buildCriteria = () : QueryCriteria => {
            const payload : QueryCriteria = {};
            if (variants.value.length > 0) {
                for (let i = 0; i < variants.value.length; i++) {
                    const variant = variants.value[i].data;
                    if (!variant) {
                        continue;
                    }

                    const keys = Object.keys(variant);
                    let isValid = false;
                    const group : Record<string, CodeRecord> = {};

                    for (let j = 0; j < keys.length; j++) {
                        const code = variant[keys[j] as keyof typeof variant];
                        if (code && code.length > 0) {
                            group[keys[j]] = {
                                code,
                            };
                            isValid = true;
                        }
                    }

                    if (isValid) {
                        if (!payload.variants) {
                            payload.variants = [];
                        }

                        payload.variants.push(group);
                    }
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
                    const id = `${categories.value[i].id}`;
                    const index = id.indexOf(':::');

                    payload.diagnoses.push({
                        system: id.substring(0, index),
                        code: id.substring(index + 3),
                    });
                }
            }

            return payload;
        };

        const save = () => {
            emit('save', buildCriteria());
        };

        const submit = async () => {
            if (busy.value) return;

            busy.value = true;

            const payload = buildCriteria();

            try {
                filterStore.reset();
                filterStore.resetActive();

                let query : QuerySession;

                if (props.queryId) {
                    query = await apiClient.query.update(props.queryId, {
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
                        sites: modeSites.value,
                    });

                    emit('updated', query);
                } else {
                    query = await apiClient.query.submit({
                        criteria: payload,
                        mode: {
                            code: mode.value,
                        },
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
            id: coding.code,
            value: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        return {
            mode,
            modeSites,
            modeOptions,

            busy,
            hpoTerms,
            categories,

            selectCategory,
            selectHPOTerm,

            variants,
            save,
            submit,

            parseCategory,
            transformCodings,
        };
    },
});
</script>
<template>
    <div>
        <form>
            <div class="row mb-3">
                <div class="col">
                    <h6><i class="fa fa-diagnoses" /> Diagnose </h6>

                    <div class="form-group">
                        <label>Kategorie</label>
                        <DValueSet
                            :code="'dnpm-dip/rd/disease-category'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <DCollectionTransform
                                    :items="data.codings"
                                    :transform="parseCategory"
                                >
                                    <template #default="options">
                                        <VCFormSelectSearch
                                            v-model="categories"
                                            :multiple="true"
                                            :options="options"
                                            placeholder="..."
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
                                    placeholder="..."
                                />
                            </template>
                        </DValueSet>
                    </div>
                </div>
                <div class="col">
                    <h6><i class="fas fa-microscope" /> HPO</h6>

                    <div class="form-group">
                        <label>Term</label>
                        <DValueSet
                            :code="'https://hpo.jax.org'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <DCollectionTransform
                                    :items="data.codings"
                                    :transform="transformCodings"
                                >
                                    <template #default="options">
                                        <VCFormSelectSearch
                                            v-model="hpoTerms"
                                            :multiple="true"
                                            :options="options"
                                            placeholder="Human Phenotype Ontology"
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
                                    :disabled="true"
                                    :options="[]"
                                    placeholder="Human Phenotype Ontology"
                                />
                            </template>
                        </DValueSet>
                    </div>
                </div>
            </div>

            <hr>

            <div class="row mb-2">
                <div class="col">
                    <h6><i class="fa fa-dna" /> Varianten</h6>
                </div>

                <DFormTabGroups
                    v-model="variants"
                    :min-items="1"
                    :max-items="6"
                >
                    <!-- todo: label; max 15 zeichen; {{Gene}} ({{dnaÄnderung}} || -->
                    <!-- todo: {{proteinänderung}}) || proteinänderung precedence vorrang dnaÄnderung -->
                    <template #default="props">
                        <RVariantFormTabGroup
                            :entity="props.data"
                            @saved="props.saved"
                        />
                    </template>
                </DFormTabGroups>
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
                        :use-case="'rd'"
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

                    <div class="col">
                        <button
                            :disabled="busy"
                            type="button"
                            class="btn btn-block btn-primary"
                            @click.prevent="save()"
                        >
                            <i class="fa fa-save me-1" /> Speichern
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
