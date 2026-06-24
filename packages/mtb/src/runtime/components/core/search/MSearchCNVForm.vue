<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    DCollectionTransform,
    DValueSet,
    type ValueSetCoding,
    toCoding,
} from '@dnpm-dip/core';
import { VCFormSelectSearch } from '@vuecs/forms';
import {
    type PropType, 
    computed, 
    defineComponent, 
    reactive, 
    toRef, 
    watch,
} from 'vue';
import { type QueryGeneAlterationCNVCriteria, QueryMutationType } from '../../../domains';

export default defineComponent({
    components: {
        DValueSet,
        DCollectionTransform,
        VCFormSelectSearch,
    },
    props: { entity: Object as PropType<QueryGeneAlterationCNVCriteria> },
    emits: ['updated'],
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');
        const form = reactive<QueryGeneAlterationCNVCriteria<string>>({
            type: QueryMutationType.CNV,
            copyNumberType: [],
        });

        const init = () => {
            if (!props.entity) return;

            if (props.entity.copyNumberType) {
                form.copyNumberType = props.entity.copyNumberType.map((coding) => `${coding.code}`);
            }
        };

        init();

        watch(entityRef, () => {
            init();
        });

        const transformCodings = (coding: ValueSetCoding) => ({
            value: coding.code,
            label: coding.display ? `${coding.display}` : coding.code,
        });

        const isEditing = computed(() => !!entityRef.value);
        const handleChanged = () => {
            const output : QueryGeneAlterationCNVCriteria = { type: QueryMutationType.CNV };

            if (form.copyNumberType) {
                output.copyNumberType = form.copyNumberType.map((code) => toCoding(code));
            }

            emit('updated', output);
        };

        return {
            form,
            transformCodings,
            isEditing,
            handleChanged,
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
                        :items="data.codings || []"
                        :transform="transformCodings"
                    >
                        <template #default="options">
                            <VCFormSelectSearch
                                v-model="form.copyNumberType"
                                :options="options"
                                :close-on-select="true"
                                placeholder="CNV Type"
                                @change="handleChanged"
                            />
                        </template>
                    </DCollectionTransform>
                </template>
                <template #loading>
                    <VCFormSelectSearch
                        :options="[]"
                        :disabled="true"
                        placeholder="CNV Type"
                    />
                </template>
            </DValueSet>
        </template>
    </VCFormGroup>
</template>
