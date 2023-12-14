<script lang="ts">
import { max } from '@floating-ui/utils';
import {
    type PropType, defineComponent, ref, toRef, watch,
} from 'vue';

export default defineComponent({
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
                currentIndex.value < -1
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

        watch(modelValue, (val) => {
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
            items.value[currentIndex.value] = { ...data };

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
    methods: { max },
});

</script>
<template>
    <div class="d-flex flex-row">
        <div
            v-if="items.length > 0"
            class="w-100"
        >
            <slot
                :item="items[currentIndex]"
                :updated="handleUpdated"
            />
        </div>
        <ul class="nav nav-pills flex-column ms-2">
            <li class="nav-item">
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
                v-for="(_,index) in items.length"
                :key="index"
            >
                <li
                    class="nav-item"
                    style="max-width: 150px;"
                >
                    <a
                        href="javascript:void(0)"
                        class="nav-link text-center"
                        :class="{'router-link-exact-active': currentIndex === index}"
                        @click="toggle(index)"
                    >
                        {{ index + 1 }}
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>
