<!--
  - Copyright (c) 2025.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import type { PropType } from 'vue';
import {
    computed, defineComponent, ref, resolveComponent,
} from 'vue';
import type { Coding, KeyValueRecord } from '../../../domains';

export default defineComponent({
    props: {
        data: {
            type: Object as PropType<KeyValueRecord<any, any>>,
            required: true,
        },
        codingVerboseLabel: {
            type: Boolean,
        },
        clickable: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['clicked', 'itemClicked'],
    setup(props, { emit }) {
        const vNode = resolveComponent('DKVTable');
        const expanded = ref(false);
        const expandable = computed(
            () => props.data.children &&
            props.data.children.length > 0,
        );

        const toggle = () => {
            if (!expandable.value) {
                return;
            }

            expanded.value = !expanded.value;
        };

        const handleItemClick = (key: string) => {
            emit('itemClicked', key);
        };

        const handleClicked = (items: Coding[]) => {
            emit('clicked', items);
        };

        return {
            vNode,
            expanded,
            expandable,
            toggle,

            handleItemClick,
            handleClicked,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-column gap-2">
        <div class="d-flex flex-row gap-2">
            <template v-if="expandable">
                <button
                    type="button"
                    class="btn btn-xs btn-dark"
                    @click.prevent="toggle"
                >
                    <i
                        class="fa"
                        :class="{
                            'fa-chevron-up': expanded,
                            'fa-chevron-down': !expanded,
                        }"
                    />
                </button>
            </template>
            <template v-if="clickable">
                <a
                    href="javascript:void(0)"
                    @click.prevent="handleItemClick(data.key)"
                >
                    {{ data.key }}
                </a>
            </template>
            <template v-else>
                {{ data.key }}
            </template>
        </div>

        <template v-if="data.children && expanded">
            <div>
                <component
                    :is="vNode"
                    :data="data.children"
                    :coding-verbose-label="codingVerboseLabel"
                    :clickable="clickable"
                    @clicked="handleClicked"
                />
            </div>
        </template>
    </div>
</template>
