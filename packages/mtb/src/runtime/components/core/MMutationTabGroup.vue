<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem,
    DCollectionTransform,
    DTags, toCoding,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { VCFormSelect, VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import {
    type PropType, type Ref, computed, reactive,
} from 'vue';
import {
    defineComponent, markRaw, ref,
} from 'vue';
import {
    FormMutationType,
    type QueryGeneAlterationCriteria,
    type QueryGeneAlterationVariantCriteria,
} from '../../domains';
import MSearchCNVForm from './search/MSearchCNVForm.vue';
import MSearchFusionForm from './search/MSearchFusionForm.vue';
import MSearchSNVForm from './search/MSearchSNVForm.vue';

export default defineComponent({
    components: {
        DCollectionTransform, DTags, VCFormSelectSearch, DCodeSystem, VCFormSelect,
    },
    emit: ['updated'],
    props: {
        entity: {
            type: Object as PropType<QueryGeneAlterationCriteria>,
        },
    },
    setup(props, { emit }) {
        const form = reactive<Partial<QueryGeneAlterationCriteria<string>>>({
            gene: '',
            supporting: false,
            negated: false,
        });

        const mutationType = ref<null | `${FormMutationType}`>(null);
        const mutationData = ref<null | QueryGeneAlterationVariantCriteria>(null);

        const mutationOptions : FormSelectOption[] = [
            { id: FormMutationType.CNV, value: 'CNV' },
            { id: FormMutationType.SNV, value: 'SNV' },
            { id: FormMutationType.FUSION, value: 'Fusion' },
        ];

        const comp = ref(null) as Ref<null | Record<string, any>>;
        const changeMutationType = (type: `${FormMutationType}` | null) => {
            switch (type) {
                case FormMutationType.CNV: {
                    comp.value = markRaw(MSearchCNVForm);

                    mutationData.value = {
                        type: FormMutationType.CNV,
                    };
                    mutationType.value = FormMutationType.CNV;
                    break;
                }
                case FormMutationType.SNV: {
                    comp.value = markRaw(MSearchSNVForm);

                    mutationData.value = {
                        type: FormMutationType.SNV,
                    };
                    mutationType.value = FormMutationType.SNV;
                    break;
                }
                case FormMutationType.FUSION: {
                    comp.value = markRaw(MSearchFusionForm);

                    mutationData.value = {
                        type: FormMutationType.FUSION,
                    };
                    mutationType.value = FormMutationType.FUSION;
                    break;
                }

                default: {
                    comp.value = null;
                    mutationData.value = null;
                    mutationType.value = null;
                    break;
                }
            }
        };

        const changeMutationTypeByEvent = (event: Event) => {
            if (!event.target) {
                return;
            }

            changeMutationType((event.target as Record<string, any>).value || null);
        };

        const isEditing = computed(() => !!props.entity && Object.keys(props.entity).length > 0);
        const init = () => {
            if (
                props.entity &&
                props.entity.variant
            ) {
                changeMutationType(props.entity.variant.type);
                return;
            }

            changeMutationType(null);
        };

        init();

        const handleUpdated = (data: QueryGeneAlterationVariantCriteria | null) => {
            mutationData.value = data;
        };

        const submit = () => {
            emit('updated', {
                gene: form.gene ? toCoding(form.gene) : undefined,
                supporting: form.supporting,
                negated: form.negated,
                ...(mutationData.value ? { variant: mutationData.value } : {}),
            } satisfies QueryGeneAlterationCriteria);
        };

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        return {
            form,

            changeMutationTypeByEvent,
            comp,

            mutationType,
            mutationOptions,

            handleUpdated,

            isEditing,
            transformConcepts,

            submit,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-column gap-2">
        <VCFormGroup>
            <template #label>
                Gen
            </template>
            <template #default>
                <DCodeSystem
                    :code="'https://www.genenames.org/'"
                    :lazy-load="true"
                >
                    <template #default="{ data }">
                        <DCollectionTransform
                            :items="data.concepts"
                            :transform="transformConcepts"
                        >
                            <template #default="options">
                                <VCFormSelectSearch
                                    v-model="form.gene"
                                    :options="options"
                                    placeholder="HGNC"
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
                            placeholder="HGNC"
                        />
                    </template>
                </DCodeSystem>
            </template>
        </VCFormGroup>
        <VCFormGroup>
            <template #label>
                Mutationsart
            </template>
            <template #default>
                <VCFormSelect
                    v-model="mutationType"
                    :options="mutationOptions"
                    @change="changeMutationTypeByEvent"
                />
            </template>
        </VCFormGroup>
        <template v-if="comp && mutationType">
            <component
                :is="comp"
                :entity="entity"
                @updated="handleUpdated"
            />
        </template>
        <div class="d-flex flex-row gap-2">
            <div>
                <VCFormInputCheckbox
                    v-model="form.supporting"
                    :group-class="'form-switch'"
                    :label="true"
                    :label-content="'Stützend?'"
                />
            </div>
            <div>
                <VCFormInputCheckbox
                    v-model="form.negated"
                    :group-class="'form-switch'"
                    :label="true"
                    :label-content="'Negiert?'"
                />
            </div>
        </div>
        <div>
            <button
                type="button"
                class="btn btn-secondary btn-xs"
                @click.prevent="submit()"
            >
                {{ isEditing ? 'Aktualisieren' : 'Hinzufügen' }}
            </button>
        </div>
    </div>
</template>
