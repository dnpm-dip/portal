<script lang="ts">
import {
    type CodeSystemConcept,
    DCodeSystem,
    DCollectionTransform,
    DFormSelectSearch,
    DTags,
    transformConceptToFormSelectOption,
} from '@dnpm-dip/core';
import {
    type PropType, computed, defineComponent, reactive, toRef, watch,
} from 'vue';
import type { QueryFusionCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DCodeSystem, DCollectionTransform, DFormSelectSearch,
    },
    props: {
        entity: Object as PropType<QueryFusionCriteria<string>>,
    },
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<QueryFusionCriteria<string>>({
            fusionPartner3pr: '',
            fusionPartner5pr: '',
        });

        const init = () => {
            if (!props.entity) return;

            form.fusionPartner3pr = props.entity?.fusionPartner3pr || '';
            form.fusionPartner5pr = props.entity?.fusionPartner5pr || '';
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        const isEditing = computed(() => !!entityRef.value);
        const submit = () => {
            emit('updated', {
                fusionPartner3pr: form.fusionPartner3pr,
                fusionPartner5pr: form.fusionPartner5pr,
            } satisfies QueryFusionCriteria<string>);
        };

        return {
            form,
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
            3'-Gene
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
                                v-model="form.fusionPartner3pr"
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
    <VCFormGroup>
        <template #label>
            5'-Gene
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
                                v-model="form.fusionPartner5pr"
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
            {{ isEditing ? 'Aktualisiern' : 'Hinzufügen' }}
        </button>
    </div>
</template>
