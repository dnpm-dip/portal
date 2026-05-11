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
    onUnmounted,
    ref,
    watch,
} from 'vue';
import type { KeyValueRecord, KeyValueRecords } from '../../../domains';
import { QueryEventBusEventName, injectQueryEventBus } from '../../../services';
import { generateChartLabelsForKeyValueRecord } from '../../utility/chart/utils';

type LabelFn = (item: KeyValueRecord) => string | undefined;

export default defineComponent({
    components: { VCFormSelectSearch },
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        items: { type: Array as PropType<KeyValueRecords> },
        selectFirst: {
            type: Boolean,
            default: false,
        },
        labelFn: {
            type: Function as PropType<LabelFn>,
            default: undefined,
        },
    },
    setup(props) {
        const queryEventBus = injectQueryEventBus();
        const id = ref(undefined) as Ref<string | number | undefined>;
        const item = ref(null) as Ref<KeyValueRecord | null>;

        const options = computed<FormSelectOption[]>(() => {
            if (!props.items) {
                return [];
            }

            return props.items.map((el, id) => ({
                id,
                value: props.labelFn ?
                    props.labelFn(el) :
                    generateChartLabelsForKeyValueRecord(el),
            }));
        });

        const selected = ref<string | null>(null);

        const render = () => {
            if (!props.items || selected.value === null) {
                item.value = null;
                return;
            }

            const index = props.items.findIndex(
                (_el, id) => id === Number.parseInt(`${selected.value}`, 10),
            );

            const found = index !== -1 ? props.items[index] : undefined;
            if (found) {
                item.value = found;
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

        const init = () => {
            if (!props.selectFirst || !props.items || props.items.length === 0) {
                return;
            }

            id.value = 0;
            selected.value = '0';
            render();
        };

        init();

        const removeSessionHandler = queryEventBus.on(QueryEventBusEventName.SESSION_UPDATED, () => render());
        const removeFiltersHandler = queryEventBus.on(QueryEventBusEventName.FILTERS_COMMITED, () => render());

        onUnmounted(() => {
            removeSessionHandler();
            removeFiltersHandler();
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
