<script lang="ts">
import {
    DCollectionTransform, DFormSelectSearch, DTags, DValueSet, type ValueSetCoding,
} from '@dnpm-dip/core';
import { defineComponent, reactive } from 'vue';
import type { QuerySNVCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DValueSet, DCollectionTransform, DFormSelectSearch,
    },
    setup() {
        const form = reactive<QuerySNVCriteria<string>>({
            gene: '',
            dnaChange: '',
            proteinChange: '',
        });

        const transformCodings = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display ? `${coding.code}: ${coding.display}` : coding.code,
        });

        return {
            form,
            transformCodings,
        };
    },
});
</script>
<template>
    <div class="form-group">
        <label>Gene</label>
        <DValueSet
            :code="'https://www.genenames.org/'"
            :lazy-load="true"
        >
            <template #default="{ data }">
                <DCollectionTransform
                    :items="data.codings"
                    :transform="transformCodings"
                >
                    <template #default="options">
                        <DFormSelectSearch
                            v-model="form.gene"
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
        </DValueSet>
    </div>
    <VCFormGroup>
        <template #label>
            DNA-Änderung
        </template>
        <template #default>
            <VCFormInput
                v-model="form.dnaChange"
                placeholder="HGVS"
            />
        </template>
    </VCFormGroup>
    <VCFormGroup>
        <template #label>
            Proteinänderung
        </template>
        <template #default>
            <VCFormInput
                v-model="form.proteinChange"
                placeholder="HGVS"
            />
        </template>
    </VCFormGroup>
</template>
