<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { type PropType, defineComponent, ref } from 'vue';
import type { KeyValueRecord } from '../../../domains';
import { DKVChart } from '../kv-chart';
import { DKVTable } from '../kv-table';

export default defineComponent({
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
            type: Array as PropType<KeyValueRecord<any, unknown>[]>,
        },
        codingVerboseLabel: {
            type: Boolean,
        },
    },
    setup() {
        const variant = ref('chart');

        const setVariant = (input: string) => {
            variant.value = input;
        };

        return {
            variant,
            setVariant,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-column gap-2">
        <div class="d-flex flex-row">
            <div class="ms-auto">
                <ul class="nav-pills nav">
                    <li class="nav-item">
                        <button
                            type="button"
                            class="nav-link btn-xs"
                            :class="{'router-link-exact-active': variant === 'chart'}"
                            @click.prevent="setVariant('chart')"
                        >
                            <i class="fas fa-chart-bar" />
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            type="button"
                            class="nav-link btn-xs"
                            :class="{'router-link-exact-active': variant === 'table'}"
                            @click.prevent="setVariant('table')"
                        >
                            <i class="fas fa-table" />
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
                >
                    <DKVTable
                        :data="data"
                        :type="type"
                        :coding-verbose-label="codingVerboseLabel"
                    />
                </slot>
            </template>
        </div>
    </div>
</template>
