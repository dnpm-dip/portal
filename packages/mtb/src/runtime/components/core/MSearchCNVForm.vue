<script lang="ts">
import {
    DCollectionTransform, DFormSelectSearch, DTags, DValueSet, type ValueSetCoding,
} from '@dnpm-dip/core';
import { defineComponent, reactive } from 'vue';
import type { QueryCNVCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DValueSet, DCollectionTransform, DFormSelectSearch,
    },
    setup() {
        const form = reactive<QueryCNVCriteria<string>>({
            affectedGenes: [],
            type: '',
        });

        const transformCodings = (coding: ValueSetCoding) => ({
            id: coding.code,
            value: coding.display ? `${coding.display}` : coding.code,
        });

        return {
            form,
            transformCodings,
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
            Gene
        </template>
        <template #default>
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
            </DValueSet>
        </template>
    </VCFormGroup>
</template>
