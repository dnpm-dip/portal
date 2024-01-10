<script lang="ts">
import type { FormSelectOption } from '@vuecs/form-controls';
import { defineComponent, markRaw, ref } from 'vue';
import type {
    PropType,
    Ref,
} from 'vue';
import { DFormSelectSearch } from '@dnpm-dip/core';
import type { QueryCNVCriteria, QueryFusionCriteria, QuerySNVCriteria } from '../../domains';
import MSearchCNVForm from './MSearchCNVForm.vue';
import MSearchSNVForm from './MSearchSNVForm.vue';
import MSearchFusionForm from './MSearchFusionForm.vue';

enum MutationType {
    SNV = 'snv',
    CNV = 'cnv',
    DNA_FUSION = 'dnaFusion',
    RNA_FUSION = 'rnaFusion',
}

type MutationSNVDefinition = {
    type: MutationType.SNV,
    data: QuerySNVCriteria<string>
};

type MutationCNVDefinition = {
    type: MutationType.CNV,
    data: QueryCNVCriteria<string>
};

type MutationDNAFusionDefinition = {
    type: MutationType.DNA_FUSION,
    data: QueryFusionCriteria<string>
};

type MutationRNAFusionDefinition = {
    type: MutationType.RNA_FUSION,
    data: QueryFusionCriteria<string>
};

type MutationDefinition = MutationSNVDefinition | MutationCNVDefinition |
MutationDNAFusionDefinition | MutationRNAFusionDefinition;

export default defineComponent({
    components: { DFormSelectSearch },
    emit: ['updated'],
    props: {
        entity: {
            type: Object as PropType<MutationDefinition>,
        },
    },
    setup(props, { emit }) {
        const options : FormSelectOption[] = [
            { id: MutationType.CNV, value: 'CNV' },
            { id: MutationType.SNV, value: 'SNV' },
            { id: MutationType.DNA_FUSION, value: 'DNA Fusion' },
            { id: MutationType.RNA_FUSION, value: 'RNA Fusion' },
        ];

        const comp = ref(null) as Ref<null | Record<string, any>>;
        const compType = ref(null);
        const changeComp = (type: MutationType) => {
            switch (type) {
                case MutationType.CNV: {
                    comp.value = markRaw(MSearchCNVForm);
                    break;
                }
                case MutationType.SNV: {
                    comp.value = markRaw(MSearchSNVForm);
                    break;
                }
                case MutationType.RNA_FUSION:
                case MutationType.DNA_FUSION: {
                    comp.value = markRaw(MSearchFusionForm);
                    break;
                }

                default: {
                    comp.value = null;
                    break;
                }
            }
        };

        const changeCompByEvent = (event: Event) => {
            if (!event.target) return;

            changeComp((event.target as Record<string, any>).value);
        };

        const init = () => {
            if (!props.entity) return;

            changeComp(props.entity.type);
        };

        return {
            changeCompByEvent,
            comp,
            compType,

            options,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            Mutationsart
        </template>
        <template #default>
            <VCFormSelect
                v-model="compType"
                :options="options"
                @change="changeCompByEvent"
            />
        </template>
    </VCFormGroup>
    <template v-if="comp">
        <component :is="comp" />
    </template>
</template>
