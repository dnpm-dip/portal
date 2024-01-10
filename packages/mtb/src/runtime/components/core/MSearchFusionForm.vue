<script lang="ts">
import {
    DCollectionTransform, DFormSelectSearch, DTags, DValueSet, type ValueSetCoding,
} from '@dnpm-dip/core';
import { defineComponent, reactive } from 'vue';
import type { QueryFusionCriteria } from '../../domains';

export default defineComponent({
    components: {
        DTags, DValueSet, DCollectionTransform, DFormSelectSearch,
    },
    setup() {
        const form = reactive<QueryFusionCriteria<string>>({
            fusionPartner3pr: '',
            fusionPartner5pr: '',
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
    <VCFormGroup>
        <template #label>
            3'-Gene
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
            </DValueSet>
        </template>
    </VCFormGroup>
    <VCFormGroup>
        <template #label>
            5'-Gene
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
            </DValueSet>
        </template>
    </VCFormGroup>
</template>
