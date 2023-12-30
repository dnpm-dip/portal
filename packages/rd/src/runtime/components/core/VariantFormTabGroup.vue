<script lang="ts">
import { type CodeSystemConcept, CodeSystemEntity } from '@dnpm-dip/core';
import {
    type PropType, defineComponent, reactive, toRef, watch,
} from 'vue';
import type { RDQueryCriteriaVariant } from '../../domains';
import CollectionTransform from '../utility/CollectionTransform.vue';
import FormSelectSearch from '../utility/FormSelectSearch.vue';

export default defineComponent({
    components: { CollectionTransform, CodeSystemEntity, FormSelectSearch },
    emit: ['updated'],
    props: {
        entity: {
            type: Object as PropType<RDQueryCriteriaVariant<string>>,
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
            if (!props.entity) return;

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
        const transformConcepts = (concept: CodeSystemConcept) => ({
            id: concept.code,
            value: `${concept.properties.Symbol}: ${concept.display}`,
        });

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
        <CodeSystemEntity
            :code="'https://www.genenames.org/'"
            :lazy-load="true"
        >
            <template #default="{ data }">
                <CollectionTransform
                    :items="data.concepts"
                    :transform="transformConcepts"
                >
                    <template #default="options">
                        <FormSelectSearch
                            v-model="form.gene"
                            :options="options"
                            placeholder="HGNC"
                            @change="handleUpdated"
                        />
                    </template>
                </CollectionTransform>
            </template>
            <template #loading>
                <FormSelectSearch
                    :disabled="true"
                    :options="[]"
                    placeholder="HGNC"
                />
            </template>
        </CodeSystemEntity>
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
                :disabled="busy"
                placeholder="HGVS"
                @change="handleUpdated"
            />
        </VCFormGroup>
    </div>
</template>
