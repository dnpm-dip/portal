<script lang="ts">
import { VCButton } from '@vuecs/button';
import { VCFormSelectSearch } from '@vuecs/forms';
import type { FormOption } from '@vuecs/forms';
import type {
    PropType,
    Ref,
} from 'vue';
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import type { Coding, DistributionNestedElements, KeyValueChildrenRecord } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../../utility/chart/utils';

export default defineComponent({
    components: { VCButton, VCFormSelectSearch },
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        placeholder: {
            type: String,
            default: '...',
        },
        data: {
            type: Array as PropType<DistributionNestedElements<Coding>>,
            required: true,
        },
        total: {
            type: Number,
            default: 0,
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
                index = Number.parseInt(input, 10) - 1;
            }

            return index;
        };

        const options = computed<FormOption[]>(() => props.data.map((el, index) => {
            const label = generateChartLabelsForKeyValueRecord(el as KeyValueChildrenRecord, { codingVerbose: props.keyVerbose });

            return {
                value: index + 1,
                label: label || '',
            };
        }));

        const reset = () => {
            id.value = null;
        };

        expose({ reset });

        const items = computed(() => {
            const index = transformToIndex(id.value);
            if (index > -1 && props.data[index]) {
                return props.data[index].children || [];
            }

            return props.data;
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
                :placeholder="placeholder"
            />
            <VCButton
                v-show="id"
                color="neutral"
                variant="soft"
                @click.prevent="reset"
            >
                <VCIcon name="fa6-solid:xmark" />
            </VCButton>
        </div>
    </VCFormGroup>
    <slot
        :id="id"
        :items="items"
    />
</template>
