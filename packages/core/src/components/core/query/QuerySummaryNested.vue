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
    setup(props, { expose }) {
        const id = ref(null) as Ref<string | number | null>;
        const transformToIndex = (input: string | number | null) => {
            let index = -1;
            if (typeof input === 'number') {
                index = input - 1;
            } else if (typeof input === 'string') {
                index = parseInt(input, 10) - 1;
            }

            return index;
        };

        const options = computed<FormSelectOption[]>(() => props.entity.elements.map((el, index) => {
            const value = generateChartLabelsForKeyValueRecord(el as KeyValueChildrenRecord, {
                codingVerbose: props.keyVerbose,
            });

            return {
                id: index + 1,
                value,
            };
        }));

        const reset = () => {
            id.value = null;
        };

        expose({
            reset,
        });

        const items = computed(() => {
            const index = transformToIndex(id.value);
            if (index > -1 && props.entity.elements[index]) {
                return props.entity.elements[index].children || [];
            }

            return props.entity.elements;
        });

        return {
            options,
            id,
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
                v-model="id"
                :options="options"
            />
            <button
                v-show="id"
                class="btn btn-secondary"
                @click.prevent="reset"
            >
                <i class="fa fa-times" />
            </button>
        </div>
    </VCFormGroup>
    <slot
        :items="items"
    />
</template>
