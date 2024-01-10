<script lang="ts">
import { DFormSelectSearch } from '@dnpm-dip/core';
import type { FormSelectOption } from '@vuecs/form-controls';
import {
    type PropType, type Ref, computed, watch,
} from 'vue';
import {
    defineComponent, markRaw, ref, toRef,
} from 'vue';
import { FormMutationType, type MutationDefinition } from '../../domains';
import MSearchCNVForm from './MSearchCNVForm.vue';
import MSearchFusionForm from './MSearchFusionForm.vue';
import MSearchSNVForm from './MSearchSNVForm.vue';

export default defineComponent({
    components: { DFormSelectSearch },
    emit: ['updated'],
    props: {
        entity: {
            type: Object as PropType<MutationDefinition>,
        },
    },
    setup(props, { emit }) {
        const entityRef = toRef(props, 'entity');

        const options : FormSelectOption[] = [
            { id: FormMutationType.CNV, value: 'CNV' },
            { id: FormMutationType.SNV, value: 'SNV' },
            { id: FormMutationType.DNA_FUSION, value: 'DNA Fusion' },
            { id: FormMutationType.RNA_FUSION, value: 'RNA Fusion' },
        ];

        const comp = ref(null) as Ref<null | Record<string, any>>;
        const changeComp = (type: FormMutationType) => {
            switch (type) {
                case FormMutationType.CNV: {
                    comp.value = markRaw(MSearchCNVForm);
                    break;
                }
                case FormMutationType.SNV: {
                    comp.value = markRaw(MSearchSNVForm);
                    break;
                }
                case FormMutationType.RNA_FUSION:
                case FormMutationType.DNA_FUSION: {
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

        const compData = ref(null);
        const compType = ref(null);

        const init = () => {
            if (props.entity) {
                changeComp(props.entity.type);

                compType.value = props.entity.type;
                compData.value = props.entity.data;
                return;
            }

            compType.value = null;
            compData.value = null;
        };

        init();

        watch(entityRef, () => {
            init();
        }, { deep: true });

        const isEditing = computed(() => !!props.entity &&
                !!props.entity.type &&
                !!props.entity.data);

        const handleUpdated = (data: Record<string, any>) => {
            compData.value = data;

            emit('updated', {
                type: compType.value,
                data: compData.value,
            });
        };

        return {
            changeCompByEvent,
            comp,
            compData,
            compType,

            options,

            handleUpdated,

            isEditing,
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
                :disabled="isEditing"
                :options="options"
                @change="changeCompByEvent"
            />
        </template>
    </VCFormGroup>
    <template v-if="comp && compType">
        <component
            :is="comp"
            :entity="compData"
            @updated="handleUpdated"
        />
    </template>
</template>
