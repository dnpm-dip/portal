<script lang="ts">
import type { FormSelectOption } from '@vuecs/form-controls';
import type {
    PropType,
    Ref,
} from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import type { KeyValueRecord, KeyValueRecords } from '../../../domains';
import { generateChartLabelsForKeyValueRecord } from '../../utility/chart/utils';

export default defineComponent({
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        items: {
            type: Array as PropType<KeyValueRecords>,
            required: true,
        },
    },
    setup(props) {
        const id = ref(undefined) as Ref<string | undefined>;
        const item = ref(null) as Ref<KeyValueRecord | null>;

        const options = computed<FormSelectOption[]>(() => props.items.map((el, id) => ({
            id,
            value: generateChartLabelsForKeyValueRecord(el),
        })));

        watch(id, (val) => {
            if (!val) {
                item.value = null;
                return;
            }

            const index = props.items.findIndex((_el, id) => id === parseInt(val, 10));
            if (index !== -1) {
                item.value = props.items[index];
            }
        });

        return {
            options,
            item,
            id,
        };
    },
});
</script>
<template>
    <VCFormGroup>
        <template #label>
            {{ label }}
        </template>

        <VCFormSelect
            v-model="id"
            :options="options"
        />
    </VCFormGroup>
    <template v-if="item">
        <slot :item="item" />
    </template>
</template>
