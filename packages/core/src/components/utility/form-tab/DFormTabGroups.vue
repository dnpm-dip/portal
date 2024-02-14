<script lang="ts">
import {
    type PropType, defineComponent, ref, toRef, watch,
} from 'vue';
import DFormTabGroup from './DFormTabGroup.vue';

export default defineComponent({
    components: { DFormTabGroup },
    props: {
        modelValue: {
            type: Array as PropType<Record<string, any>[]>,
        },
        defaultLabel: {
            type: String,
            default: 'Group',
        },
        minItems: {
            type: Number,
            default: 0,
        },
        maxItems: {
            type: Number,
        },
        createButton: {
            type: Boolean,
            default: true,
        },
        direction: {
            type: String as PropType<'row' | 'col'>,
            default: 'row',
        },
        label: {
            type: String,
            default: undefined,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const items = ref<Record<string, any>[]>([]);
        const modelValue = toRef(props, 'modelValue');
        const currentIndex = ref(-1);

        const add = () => {
            items.value.push({});
            currentIndex.value = items.value.length - 1;
        };

        const init = () => {
            if (!props.modelValue) return;

            items.value = props.modelValue;

            if (
                items.value.length > 0 &&
                currentIndex.value < 0
            ) {
                currentIndex.value = 0;
            }

            if (
                items.value.length === 0 &&
                currentIndex.value > -1
            ) {
                currentIndex.value = -1;
            }

            if (items.value.length === 0 && props.minItems > 0) {
                for (let i = 0; i < props.minItems; i++) {
                    add();
                }
            }
        };

        init();

        watch(modelValue, () => {
            init();
        }, { deep: true });

        const toggle = (index: number) => {
            if (currentIndex.value === index) {
                if (items.value.length <= props.minItems) {
                    return;
                }

                const nextIndex = index - 1;

                currentIndex.value = nextIndex < 0 ? 0 : nextIndex;

                items.value.splice(index, 1);
            } else {
                currentIndex.value = index;
            }
        };

        const handleUpdated = (data: Record<string, any>) => {
            if (currentIndex.value === -1) {
                items.value.push({ ...data });
                currentIndex.value = 0;
            } else {
                items.value[currentIndex.value] = { ...data };
            }

            emit('update:modelValue', items.value);
        };

        return {
            currentIndex,
            handleUpdated,
            items,
            add,
            toggle,
        };
    },
});

</script>
<template>
    <div
        class="d-flex"
        :class="{'flex-row': direction === 'row', 'flex-column': direction === 'col'}"
    >
        <div class="w-100">
            <slot
                :item="items[currentIndex]"
                :updated="handleUpdated"
            />
        </div>
        <ul
            class="nav nav-pills"
            :class="{'flex-column ms-2': direction === 'row', 'flex-row mt-2': direction === 'col'}"
        >
            <li
                v-if="createButton"
                class="nav-item"
                :class="{'ms-auto': direction === 'col'}"
                :style="{'order': direction === 'col' ? '1' : 0}"
            >
                <a
                    href="javascript:void(0)"
                    class="nav-link nav-link-dark text-center mb-1"
                    :class="{'disabled': maxItems && maxItems === items.length}"
                    @click.prevent="add"
                >
                    <i class="fa fa-plus" />
                </a>
            </li>
            <template
                v-for="(item,index) in items"
                :key="index"
            >
                <DFormTabGroup
                    :item="item"
                    :index="index"
                    :current-index="currentIndex"
                    :label="label"
                    @toggle="toggle"
                />
            </template>
        </ul>
    </div>
</template>
