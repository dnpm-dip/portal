<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { 
    type Component, 
    type PropType, 
    defineComponent, 
    ref, 
} from 'vue';
import type { KeyValueRecord } from '../../../domains';
import { DKVChart } from '../kv-chart';
import { DKVTable } from '../kv-table';
import type { DKVTableColumnsFn } from '../kv-table/types';

const component = defineComponent({
    components: {
        DKVTable,
        DKVChart,
    },
    props: {
        type: {
            type: String as PropType<'bar' | 'doughnut'>,
            default: 'bar',
        },
        data: {
            required: true,
            type: Array as PropType<KeyValueRecord<unknown, unknown>[]>,
        },
        codingVerboseLabel: { type: Boolean },
        clickable: {
            type: Boolean,
            default: false,
        },
        keyLabel: {
            type: String,
            default: 'Element',
        },
        valueLabel: {
            type: String,
            default: 'Häufigkeit',
        },
        percentLabel: {
            type: String,
            default: 'Prozent (%)',
        },
        keyHidden: {
            type: Boolean,
            default: false,
        },
        valueHidden: {
            type: Boolean,
            default: false,
        },
        percentHidden: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Function as PropType<DKVTableColumnsFn>,
            default: undefined,
        },
    },
    emits: ['clicked'],
    setup(_, { emit }) {
        const variant = ref('table');

        const setVariant = (input: string) => {
            variant.value = input;
        };

        const handleClick = (key: unknown) => {
            emit('clicked', key);
        };

        return {
            handleClick,

            variant,
            setVariant,
        };
    },
});

export default component as Component;
</script>
<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-row">
            <div class="ms-auto">
                <ul class="nav-pills nav">
                    <li class="nav-item">
                        <button
                            type="button"
                            class="nav-link btn-xs"
                            :class="{'router-link-exact-active': variant === 'chart'}"
                            @click.prevent="setVariant('chart')"
                        >
                            <VCIcon name="fa6-solid:chart-bar" />
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            type="button"
                            class="nav-link btn-xs"
                            :class="{'router-link-exact-active': variant === 'table'}"
                            @click.prevent="setVariant('table')"
                        >
                            <VCIcon name="fa6-solid:table" />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <template v-if="variant === 'chart'">
                <slot
                    name="chart"
                    :data="data"
                    :type="type"
                >
                    <DKVChart
                        :items="data"
                        :type="type"
                        :coding-verbose-label="codingVerboseLabel"
                    />
                </slot>
            </template>
            <template v-else>
                <slot
                    name="table"
                    :data="data"
                    :type="type"
                    :clickable="clickable"
                    :coding-verbose-label="codingVerboseLabel"
                    :key-label="keyLabel"
                    :value-label="valueLabel"
                    :percent-label="percentLabel"
                    :key-hidden="keyHidden"
                    :value-hidden="valueHidden"
                    :percent-hidden="percentHidden"
                    :columns="columns"
                    :clicked="handleClick"
                >
                    <DKVTable
                        :data="data"
                        :type="type"
                        :clickable="clickable"
                        :coding-verbose-label="codingVerboseLabel"
                        :key-label="keyLabel"
                        :value-label="valueLabel"
                        :percent-label="percentLabel"
                        :key-hidden="keyHidden"
                        :value-hidden="valueHidden"
                        :percent-hidden="percentHidden"
                        :columns="columns"
                        @clicked="handleClick"
                    />
                </slot>
            </template>
        </div>
    </div>
</template>
