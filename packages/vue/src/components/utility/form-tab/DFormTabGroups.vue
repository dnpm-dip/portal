<script lang="ts">
import {
    type PropType,
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';
import DFormTabGroup from './DFormTabGroup.vue';
import type { FormTab, FormTabInput } from './types';

export default defineComponent({
    components: { DFormTabGroup },
    props: {
        modelValue: { type: Array as PropType<FormTabInput[]> },
        label: {
            type: String,
            default: '.....',
        },
        minItems: {
            type: Number,
            default: 1,
        },
        maxItems: { type: Number },
        createButton: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const items = ref<FormTab[]>([]);
        const modelValue = toRef(props, 'modelValue');
        const currentIndex = ref(-1);

        const add = () => {
            items.value.push({
                data: null,
                label: props.label,
                index: items.value.length,
            });

            currentIndex.value = items.value.length - 1;
        };

        const init = () => {
            if (!props.modelValue) return;

            items.value = props.modelValue.map((el, index) => {
                const item: FormTab = {
                    data: el.data ?? null,
                    index,
                    label: el.label ? el.label : props.label,
                };

                return item;
            });

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

        const pick = (index: number) => {
            currentIndex.value = index;
        };

        const close = (index: number) => {
            if (items.value.length === props.minItems) {
                if (index === 0 && items.value.length === 1) {
                    const first = items.value[index];
                    if (first) {
                        first.data = null;
                        first.label = props.label;
                    }
                }

                emit('update:modelValue', items.value);

                return;
            }

            if (items.value.length > 0) {
                items.value.splice(index, 1);
            }

            for (let i = 0; i < items.value.length; i++) {
                const item = items.value[i];
                if (item) {
                    item.index = i;
                }
            }

            const nextIndex = index - 1;
            currentIndex.value = nextIndex < 0 ? 0 : nextIndex;

            emit('update:modelValue', items.value);
        };

        const handleSaved = (data: FormTab) => {
            currentIndex.value = data.index;

            items.value[data.index] = {
                ...items.value[data.index],
                ...data,
            };

            emit('update:modelValue', items.value);
        };

        return {
            currentIndex,
            handleSaved,
            items,

            add,
            close,
            pick,
        };
    },
});

</script>
<template>
    <div class="flex flex-col">
        <div class="w-full">
            <slot
                :data="items[currentIndex]"
                :saved="handleSaved"
            />
        </div>
        <div class="mt-2">
            <ul class="form-tabs">
                <template
                    v-for="item in items"
                    :key="item.index"
                >
                    <DFormTabGroup
                        :item="item"
                        :current-index="currentIndex"
                        :min-items="minItems"
                        :total-items="items.length"
                        @picked="pick"
                        @closed="close"
                    />
                </template>
                <li
                    v-if="createButton"
                    class="form-tab"
                >
                    <a
                        href="javascript:void(0)"
                        class="form-tab-action text-success-600"
                        :class="{'disabled': maxItems && maxItems === items.length}"
                        @click.prevent="add"
                    >
                        <VCIcon name="fa6-solid:plus" />
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
.form-tabs {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.375rem;

    list-style: none;
    padding: 0;
    margin-block-start: 0;
}

.form-tab {
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;

    text-decoration: none;
    border: 0;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    max-width: 150px;
    overflow-y: hidden;

    align-items: center;
    justify-content: center;

    color: var(--vc-color-fg-muted);
    background-color: var(--vc-color-bg-muted);
}
.form-tab.active {
    color: var(--vc-color-on-primary);
    background-color: var(--vc-color-primary-600);
}

.form-tab-text {
    user-select: none;
    cursor: pointer;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.form-tab-action {
    display: inline-flex;
    align-items: center;

    color: inherit;
    text-decoration: none;
}

.form-tab-action.disabled {
    pointer-events: none;
    opacity: 0.65;
}
</style>
