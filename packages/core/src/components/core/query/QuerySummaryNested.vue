<script lang="ts">
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import type {
    PropType,
    Ref,
} from 'vue';
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import type { DistributionNested, KeyValueChildrenRecord } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../../utility/chart/utils';

export default defineComponent({
    components: {
        VCFormSelectSearch,
    },
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        entity: {
            type: Object as PropType<DistributionNested>,
            required: true,
        },
        keyVerbose: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const index = ref(undefined) as Ref<string | undefined>;

        const options = computed<FormSelectOption[]>(() => props.entity.elements.map((el, id) => {
            const value = generateChartLabelsForKeyValueRecord(el as KeyValueChildrenRecord, {
                codingVerbose: props.keyVerbose,
            });

            return {
                id: id + 1,
                value,
            };
        }));

        const reset = () => {
            index.value = undefined;
        };

        const items = computed(() => {
            if (index.value) {
                const idx = parseInt(index.value, 10) - 1;
                return props.entity.elements[idx].children || [];
            }

            return props.entity.elements;
        });

        return {
            options,
            index,
            items,
            reset,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            {{ label }}
        </template>

        <div class="input-group">
            <VCFormSelectSearch
                v-model="index"
                :options="options"
            />
            <button
                v-show="index"
                :key="index"
                class="btn btn-secondary"
                @click.prevent="reset"
            >
                <i class="fa fa-times" />
            </button>
        </div>
    </VCFormGroup>
    <slot :items="items" />
</template>
