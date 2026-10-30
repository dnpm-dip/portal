<script lang="ts">
import { VCFormGroup, VCFormSelectSearch } from '@vuecs/forms';
import { isEqual } from 'smob';
import type { FormOption } from '@vuecs/forms';
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
import type { KeyValueRecord } from '@dnpm-dip/http-kit';
import { QueryEventBusEventName, injectQueryEventBus } from '../../../services';
import { generateChartLabelsForKeyValueRecord } from '../../utility/chart/utils';

type LabelFn = (item: KeyValueRecord<unknown, unknown>) => string | undefined;

export default defineComponent({
    components: { VCFormGroup, VCFormSelectSearch },
    props: {
        label: {
            type: String,
            default: 'Gruppe',
        },
        placeholder: {
            type: String,
            default: '...',
        },
        items: { type: Array as PropType<KeyValueRecord<unknown, unknown>[]> },
        selectFirst: {
            type: Boolean,
            default: false,
        },
        labelFn: {
            type: Function as PropType<LabelFn>,
            default: undefined,
        },
    },
    setup(props, { expose }) {
        const queryEventBus = injectQueryEventBus();
        const id = ref(undefined) as Ref<string | number | undefined>;
        const item = ref(null) as Ref<KeyValueRecord<unknown, unknown> | null>;

        const options = computed<FormOption[]>(() => {
            if (!props.items) {
                return [];
            }

            return props.items.map((el, id) => ({
                value: id,
                label: (props.labelFn ?
                    props.labelFn(el) :
                    generateChartLabelsForKeyValueRecord(el)) || '',
            }));
        });

        const select = (index: number) => {
            item.value = props.items?.[index] || null;
            id.value = item.value ? index : undefined;
        };

        watch(id, (val) => {
            select(typeof val === 'undefined' || val === '' ? -1 : Number(val));
        });

        const reset = () => select(props.selectFirst ? 0 : -1);
        const render = () => {
            if (!item.value) {
                reset();
                return;
            }

            const index = props.items?.findIndex((entry) => isEqual(entry.key, item.value?.key)) ?? -1;
            if (index === -1) {
                reset();
            } else {
                select(index);
            }
        };

        reset();
        watch(() => props.items, render);
        expose({ reset });

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
            :placeholder="placeholder"
        />
    </VCFormGroup>
    <template v-if="item">
        <slot :item="item" />
    </template>
</template>
