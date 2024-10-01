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
    inject,
    ref,
    watch,
} from 'vue';
import { InjectionKey } from '../../../constants';
import type { KeyValueRecord, KeyValueRecords } from '../../../domains';
import type { URLQueryRecord } from '../../../utils';
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
        items: {
            type: Array as PropType<KeyValueRecords>,
        },
    },
    setup(props) {
        const id = ref(undefined) as Ref<string | undefined>;
        const item = ref(null) as Ref<KeyValueRecord | null>;

        const options = computed<FormSelectOption[]>(() => {
            if (!props.items) {
                return [];
            }

            return props.items.map((el, id) => ({
                id,
                value: generateChartLabelsForKeyValueRecord(el),
            }));
        });

        const selected = ref<string | null>(null);

        const render = () => {
            if (!props.items || selected.value === null) {
                item.value = null;
                return;
            }

            const index = props.items.findIndex(
                (_el, id) => id === parseInt(`${selected.value}`, 10),
            );

            if (index !== -1) {
                item.value = props.items[index];
            }
        };

        watch(id, (val) => {
            if (typeof val === 'undefined' || val === '') {
                selected.value = null;
                return;
            }

            selected.value = `${val}`;

            render();
        });

        const queryFilters = inject(InjectionKey.QUERY_FILTERS) as Ref<URLQueryRecord>;
        watch(queryFilters, () => {
            render();
        });

        const queryUpdatedAt = inject(InjectionKey.QUERY_UPDATED_AT) as Ref<string>;
        watch(queryUpdatedAt, () => {
            render();
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

        <VCFormSelectSearch
            v-model="id"
            :options="options"
        />
    </VCFormGroup>
    <template v-if="item">
        <slot :item="item" />
    </template>
</template>
