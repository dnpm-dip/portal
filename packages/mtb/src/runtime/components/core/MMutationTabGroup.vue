<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem,
    DCollectionTransform,
    toCoding,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { VCFormSelect, VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import {
    type PropType, type Ref, computed, reactive, toRef, watch,
} from 'vue';
import {
    defineComponent, markRaw, ref,
} from 'vue';
import {
    type QueryGeneAlterationCriteria,
    type QueryGeneAlterationVariantCriteria,
    QueryMutationType,
} from '../../domains';
import MSearchCNVForm from './search/MSearchCNVForm.vue';
import MSearchFusionForm from './search/MSearchFusionForm.vue';
import MSearchSNVForm from './search/MSearchSNVForm.vue';

export default defineComponent({
    components: {
        DCollectionTransform, VCFormSelectSearch, DCodeSystem, VCFormSelect,
    },
    emit: ['updated', 'toggle'],
    props: {
        entity: {
            type: Object as PropType<QueryGeneAlterationCriteria>,
        },
    },
    setup(props, { emit }) {
        const entity = toRef(props, 'entity');
        const form = reactive<Partial<QueryGeneAlterationCriteria<string>>>({
            gene: '',
            supporting: false,
            negated: false,
        });

        const mutationType = ref<null | `${QueryMutationType}`>(null);
        const mutationData = ref<null | QueryGeneAlterationVariantCriteria>(null);

        const mutationOptions : FormSelectOption[] = [
            { id: QueryMutationType.CNV, value: 'CNV' },
            { id: QueryMutationType.SNV, value: 'SNV' },
            { id: QueryMutationType.FUSION, value: 'Fusion' },
        ];

        const comp = ref(null) as Ref<null | Record<string, any>>;
        const changeMutationType = (type: `${QueryMutationType}` | null) => {
            switch (type) {
                case QueryMutationType.CNV: {
                    comp.value = markRaw(MSearchCNVForm);

                    mutationData.value = {
                        type: QueryMutationType.CNV,
                    };
                    mutationType.value = QueryMutationType.CNV;
                    break;
                }
                case QueryMutationType.SNV: {
                    comp.value = markRaw(MSearchSNVForm);

                    mutationData.value = {
                        type: QueryMutationType.SNV,
                    };
                    mutationType.value = QueryMutationType.SNV;
                    break;
                }
                case QueryMutationType.FUSION: {
                    comp.value = markRaw(MSearchFusionForm);

                    mutationData.value = {
                        type: QueryMutationType.FUSION,
                    };
                    mutationType.value = QueryMutationType.FUSION;
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
            if (!props.entity) {
                return;
            }

            if (
                props.entity.variant &&
                props.entity.variant.type
            ) {
                changeMutationType(props.entity.variant.type);
            } else {
                changeMutationType(null);
            }

            if (props.entity.gene) {
                form.gene = `${props.entity.gene.code}+++${props.entity.gene.display}`;
            } else {
                form.gene = '';
            }

            if (typeof props.entity.supporting !== 'undefined') {
                form.supporting = props.entity.supporting;
            } else {
                form.supporting = false;
            }

            if (typeof props.entity.negated !== 'undefined') {
                form.negated = props.entity.negated;
            } else {
                form.negated = false;
            }
        };

        init();

        watch(entity, () => {
            init();
        }, { deep: true });

        const submit = () => {
            if (form.gene) {
                const [code, display] = form.gene.split('+++');
                emit('updated', {
                    gene: { code, display },
                    supporting: form.supporting,
                    negated: form.negated,
                    ...(mutationData.value ? { variant: mutationData.value } : {}),
                } satisfies QueryGeneAlterationCriteria);
            } else {
                emit('toggle');
            }
        };

        const handleVariantChanged = (data: QueryGeneAlterationVariantCriteria | null) => {
            mutationData.value = data;
        };

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => {
            const option : FormSelectOption = {
                id: `${concept.code}+++${concept.display}`,
                value: concept.display,
            };

            return option;
        };

        return {
            form,

            changeMutationTypeByEvent,
            comp,

            mutationType,
            mutationOptions,

            handleVariantChanged,

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
                                />
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
                @updated="handleVariantChanged"
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
                @click.prevent="submit"
            >
                Speichern
            </button>
        </div>
    </div>
</template>
