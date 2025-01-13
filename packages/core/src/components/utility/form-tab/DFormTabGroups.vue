<script lang="ts">
import {
    type PropType, defineComponent, ref, toRef, watch,
} from 'vue';
import DFormTabGroup from './DFormTabGroup.vue';
import type { FormTab, FormTabInput } from './types';

export default defineComponent({
    components: { DFormTabGroup },
    props: {
        modelValue: {
            type: Array as PropType<FormTabInput[]>,
        },
        label: {
            type: String,
            default: 'Neuer Tab',
        },
        minItems: {
            type: Number,
            default: 1,
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
                    items.value[index].data = null;
                    items.value[index].label = props.label;
                }

                emit('update:modelValue', items.value);

                return;
            }

            if (items.value.length > 0) {
                items.value.splice(index, 1);
            }

            for (let i = 0; i < items.value.length; i++) {
                items.value[i].index = i;
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
    <div
        class="d-flex"
        :class="{'flex-row': direction === 'row', 'flex-column': direction === 'col'}"
    >
        <div class="w-100">
            <slot
                :data="items[currentIndex]"
                :saved="handleSaved"
            />
        </div>
        <div
            class="d-flex"
            :class="{'flex-column ms-2': direction === 'row', 'flex-row mt-2': direction === 'col'}"
        >
            <div>
                <ul
                    class="form-tabs"
                    :class="{'flex-column': direction === 'row'}"
                >
                    <template
                        v-for="item in items"
                        :key="item.index"
                    >
                        <DFormTabGroup
                            :item="item"
                            :current-index="currentIndex"
                            :min-items="minItems"
                            :max-items="maxItems"
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
                            class="nav-link nav-link-dark text-center mb-1"
                            :class="{'disabled': maxItems && maxItems === items.length}"
                            @click.prevent="add"
                        >
                            <i class="fa fa-plus" />
                        </a>
                    </li>
                </ul>
            </div>
            <div
                :class="{'ms-auto': direction === 'col', 'mt-auto': direction !== 'col'}"
                :style="{'order': direction === 'col' ? '1' : 0}"
            >
                <ul class="nav nav-pills" />
            </div>
        </div>
    </div>
</template>
<style>
.form-tabs {
    display: flex;
    flex-direction: row;

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

    color: #5b646c;
    background-color: #ececec;
}
.form-tab.active {
    color: #fff;
    background-color: #6d7fcc;
}

.form-tab-text {
    user-select: none;
    cursor: pointer;
}
</style>
