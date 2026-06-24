<script lang="ts">
import {
    type CodeRecord,
    type Coding,
    type ConnectionPeer,
    DLoadingModal,
    type FormTabInput,
    type ValueSetCoding,
} from '@dnpm-dip/core';
import {
    DCollectionTransform,
    DFormTabGroups,
    DSitePicker,
    DValueSet,
    QueryRequestMode,
    useQueryFilterStore,
} from '@dnpm-dip/core';
import { VCFormSelectSearch } from '@vuecs/forms';
import type { FormOption } from '@vuecs/forms';
import { type PropType, toRef, watch } from 'vue';
import {
    defineComponent, 
    ref,
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
        DLoadingModal,
        DSitePicker,
        RVariantFormTabGroup,
        DFormTabGroups,
        DCollectionTransform,
        VCFormSelectSearch,
        DValueSet,
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
            { value: QueryRequestMode.LOCAL, label: 'Lokal' },
            { value: QueryRequestMode.FEDERATED, label: 'Föderiert' },
            { value: QueryRequestMode.CUSTOM, label: 'Benutzerdefiniert' },
        ];

        const busy = ref(false);
        const criteria = toRef(props, 'criteria');

        const categories = ref<string[]>([]);
        const hpoTerms = ref<string[]>([]);
        const variants = ref<FormTabInput<QueryCriteriaVariant<string>>[]>([]);

        const parseCategory = (coding: Coding) => ({
            value: `${coding.system}:::${coding.code}`,
            label: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        const reset = async () => {
            if (busy.value) return;

            busy.value = true;

            categories.value = [];
            hpoTerms.value = [];
            variants.value = [];

            if (props.queryMode) {
                mode.value = props.queryMode;
            }

            if (props.queryPeers) {
                modeSites.value = props.queryPeers.map((peer) => peer.site);
            }

            if (criteria.value) {
                if (criteria.value.variants) {
                    for (let i = 0; i < criteria.value.variants.length; i++) {
                        const variant = criteria.value.variants[i] as QueryCriteriaVariant;
                        const data: QueryCriteriaVariant<string> = {};

                        const keys = Object.keys(variant);
                        for (const key of keys) {
                            data[key as keyof typeof data] = variant[key as keyof QueryCriteriaVariant]?.code;
                        }

                        variants.value.push({ data });
                    }
                }

                if (criteria.value.hpoTerms) {
                    for (const term of criteria.value.hpoTerms) {
                        hpoTerms.value.push(`${term.code}`);
                    }
                }

                if (criteria.value.diagnoses) {
                    for (const diagnosis of criteria.value.diagnoses) {
                        categories.value.push(`${parseCategory(diagnosis as Coding).value}`);
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

        expose({ reset });

        Promise.resolve()
            .then(() => reset());

        const buildCriteria = () : QueryCriteria => {
            const payload : QueryCriteria = {};
            if (variants.value.length > 0) {
                for (const entry of variants.value) {
                    const variant = entry.data;
                    if (!variant) {
                        continue;
                    }

                    const keys = Object.keys(variant);
                    let isValid = false;
                    const group : Record<string, CodeRecord> = {};

                    for (const key of keys) {
                        const code = variant[key as keyof typeof variant];
                        if (code && code.length > 0) {
                            group[key] = { code };
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

                for (const term of hpoTerms.value) {
                    payload.hpoTerms.push({ code: term });
                }
            }

            if (categories.value.length > 0) {
                payload.diagnoses = [];

                for (const category of categories.value) {
                    const id = `${category}`;
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

        return {
            mode,
            modeSites,
            modeOptions,

            busy,
            hpoTerms,
            categories,

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
            <div class="flex flex-wrap -mx-2 mb-3">
                <div class="flex-1 basis-0 px-2">
                    <h6><VCIcon name="fa6-solid:notes-medical" /> Diagnose </h6>

                    <div class="mb-3">
                        <label>Kategorie</label>
                        <DValueSet
                            :code="'dnpm-dip/rd/diagnosis/code-systems'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <DCollectionTransform
                                    :items="data.codings || []"
                                    :transform="parseCategory"
                                >
                                    <template #default="options">
                                        <VCFormSelectSearch
                                            v-model="categories"
                                            :options="options"
                                            :close-on-select="true"
                                            placeholder="..."
                                        />
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
                <div class="flex-1 basis-0 px-2">
                    <h6><VCIcon name="fa6-solid:microscope" /> HPO</h6>

                    <div class="mb-3">
                        <label>Term</label>
                        <DValueSet
                            :code="'https://hpo.jax.org'"
                            :lazy-load="true"
                        >
                            <template #default="{ data }">
                                <DCollectionTransform
                                    :items="data.codings || []"
                                    :transform="transformCodings"
                                >
                                    <template #default="options">
                                        <VCFormSelectSearch
                                            v-model="hpoTerms"
                                            :options="options"
                                            :close-on-select="true"
                                            placeholder="Human Phenotype Ontology"
                                        />
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

            <div class="mb-2">
                <h6><VCIcon name="fa6-solid:dna" /> Varianten</h6>

                <div class="mt-2">
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
            </div>

            <hr>

            <div>
                <h6><VCIcon name="fa6-solid:filter" /> Suchmodus</h6>

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

            <div
                class="sticky bottom-0 z-10 mt-4 flex flex-wrap items-center justify-end gap-2
                       border-t border-border bg-bg/85 py-3 backdrop-blur"
            >
                <VCButton
                    :disabled="busy"
                    type="button"
                    color="neutral"
                    variant="soft"
                    title="Suchkriterien als gespeicherte Anfrage ablegen"
                    @click.prevent="save()"
                >
                    <VCIcon name="fa6-solid:floppy-disk" />
                    Speichern
                </VCButton>

                <VCButton
                    color="primary"
                    class="min-w-36"
                    :loading="busy"
                    @click.prevent="submit()"
                >
                    <VCIcon
                        name="fa6-solid:magnifying-glass"
                        class="me-1"
                    /> Suchen
                </VCButton>
            </div>
        </form>

        <DLoadingModal :display="busy" />
    </div>
</template>
