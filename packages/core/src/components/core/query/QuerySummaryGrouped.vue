<script lang="ts">
import type { FormSelectOption } from '@vuecs/form-controls';
import type {
    PropType,
    Ref,
} from 'vue';
import {
    computed, defineComponent, ref, watch,
} from 'vue';
import type { QuerySummaryGrouped, QuerySummaryGroupedItem } from '../../../domains';

export default defineComponent({
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        items: {
            type: Array as PropType<QuerySummaryGrouped>,
            required: true,
        },
    },
    setup(props) {
        const id = ref(undefined) as Ref<string | undefined>;
        const item = ref(null) as Ref<QuerySummaryGroupedItem | null>;

        const options = computed<FormSelectOption[]>(() => props.items.map((el) => ({
            id: el.key.code,
            value: el.key.display || el.key.code,
        })));

        watch(id, (val) => {
            if (!val) {
                item.value = null;
                return;
            }

            const index = props.items.findIndex((el) => el.key.code === val);
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
