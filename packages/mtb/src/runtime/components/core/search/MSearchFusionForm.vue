<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem,
    DCollectionTransform,
    DTags,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import { VCFormSelectSearch } from '@vuecs/form-controls';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import { type QueryGeneAlterationFusionCriteria, QueryMutationType } from '../../../domains';

export default defineComponent({
    components: {
        DTags, DCodeSystem, DCollectionTransform, VCFormSelectSearch,
    },
    props: {
        entity: Object as PropType<QueryGeneAlterationFusionCriteria>,
    },
    emits: ['updated'],
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<QueryGeneAlterationFusionCriteria<string>>({
            partner: '',
            type: QueryMutationType.FUSION,
        });

        const init = () => {
            if (!props.entity) return;

            form.partner = props.entity?.partner?.code || '';
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entityRef.value);
        const handleChanged = () => {
            if (form.partner) {
                emit('updated', {
                    type: QueryMutationType.FUSION,
                    partner: {
                        code: form.partner,
                    },
                } satisfies QueryGeneAlterationFusionCriteria);
            }

            emit('updated', null);
        };

        return {
            form,
            transformConcepts,
            isEditing,
            handleChanged,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            Partner
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
                                v-model="form.partner"
                                :options="options"
                                placeholder="HGNC"
                                @change="handleChanged"
                            >
                                <template #selected="{ items, toggle }">
                                    <DTags
                                        :emit-only="true"
                                        :items="items"
                                        tag-variant="light"
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
</template>
