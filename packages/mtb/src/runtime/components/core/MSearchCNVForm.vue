<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem,
    DCollectionTransform,
    DFormSelectSearch,
    DTags,
    DValueSet,
    type ValueSetCoding,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import type { FormSelectOption } from '@vuecs/form-controls';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import type { QueryCNVCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DCodeSystem, DValueSet, DCollectionTransform, DFormSelectSearch,
    },
    props: {
        entity: Object as PropType<QueryCNVCriteria<FormSelectOption, string>>,
    },
    emits: ['updated'],
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<QueryCNVCriteria<FormSelectOption, string>>({
            affectedGenes: [],
            type: '',
        });

        const init = () => {
            if (!props.entity) return;

            form.affectedGenes = props.entity?.affectedGenes ?? [];
            form.type = props.entity?.type || '';
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformCodings = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display ? `${coding.display}` : coding.code,
        });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entityRef.value);
        const submit = () => {
            emit('updated', {
                affectedGenes: form.affectedGenes,
                type: form.type,
            } satisfies QueryCNVCriteria<FormSelectOption, string>);
        };

        return {
            form,
            transformCodings,
            transformConcepts,
            isEditing,
            submit,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            Type
        </template>
        <template #default>
            <DValueSet
                :code="'dnpm-dip/mtb/ngs-report/cnv/type'"
                :lazy-load="true"
            >
                <template #default="{ data }">
                    <DCollectionTransform
                        :items="data.codings"
                        :transform="transformCodings"
                    >
                        <template #default="options">
                            <DFormSelectSearch
                                v-model="form.type"
                                :options="options"
                                placeholder="CNV Type"
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
                        placeholder="CNV Type"
                    />
                </template>
            </DValueSet>
        </template>
    </VCFormGroup>
    <VCFormGroup>
        <template #label>
            Betroffene Gene
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
                            <DFormSelectSearch
                                v-model="form.affectedGenes"
                                :multiple="true"
                                :options="options"
                                placeholder="HGNC"
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
                        placeholder="HGNC"
                    />
                </template>
            </DCodeSystem>
        </template>
    </VCFormGroup>
    <div>
        <button
            :disabled="busy"
            type="button"
            class="btn btn-secondary btn-xs"
            @click.prevent="submit()"
        >
            {{ isEditing ? 'Aktualisieren' : 'Hinzufügen' }}
        </button>
    </div>
</template>
