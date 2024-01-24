<script lang="ts">
import { type CodeSystemConcept, transformConceptToFormSelectOption } from '@dnpm-dip/core';
import {
    type PropType, defineComponent, reactive, toRef, watch,
} from 'vue';
import { DCodeSystem, DCollectionTransform, DFormSelectSearch } from '@dnpm-dip/core';
import type { QueryCriteriaVariant } from '../../domains';

export default defineComponent({
    components: { DCollectionTransform, DCodeSystem, DFormSelectSearch },
    emit: ['updated'],
    props: {
        entity: {
            type: Object as PropType<QueryCriteriaVariant<string>>,
        },
    },
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');

        const form = reactive({
            gene: '',
            cDNAChange: '',
            gDNAChange: '',
            proteinChange: '',
        });

        const init = () => {
            form.gene = props.entity?.gene || '';
            form.cDNAChange = props.entity?.cDNAChange || '';
            form.gDNAChange = props.entity?.gDNAChange || '';
            form.proteinChange = props.entity?.proteinChange || '';
        };

        init();

        watch(entityRef, () => {
            init();
        }, { deep: true });

        const handleUpdated = () => {
            emit('updated', form);
        };
        const transformConcepts = (
            concept: CodeSystemConcept,
        ) => transformConceptToFormSelectOption(concept);

        return {
            form,
            handleUpdated,
            transformConcepts,
        };
    },
});
</script>
<template>
    <div class="form-group">
        <label>Gene</label>
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
                            v-model="form.gene"
                            :options="options"
                            placeholder="HGNC"
                            @change="handleUpdated"
                        />
                    </template>
                </DCollectionTransform>
            </template>
            <template #loading>
                <DFormSelectSearch
                    :disabled="true"
                    :options="[]"
                    placeholder="HGNC"
                />
            </template>
        </DCodeSystem>
    </div>
    <div>
        <VCFormGroup>
            <label>kodierende DNA-Änderung</label>
            <VCFormInput
                v-model="form.cDNAChange"
                placeholder="HGVS"
                @change="handleUpdated"
            />
        </VCFormGroup>
        <VCFormGroup>
            <label>genomische DNA-Änderung</label>
            <VCFormInput
                v-model="form.gDNAChange"
                placeholder="HGVS"
                @change="handleUpdated"
            />
        </VCFormGroup>
        <VCFormGroup>
            <label>Proteinänderung</label>
            <VCFormInput
                v-model="form.proteinChange"
                placeholder="HGVS"
                @change="handleUpdated"
            />
        </VCFormGroup>
    </div>
</template>
