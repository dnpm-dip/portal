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

        const pick = (index: number) => {
            currentIndex.value = index;
        };

        const close = (index: number) => {
            if (items.value.length === props.minItems || index < -1) {
                return;
            }

            const nextIndex = index - 1;

            currentIndex.value = nextIndex < 0 ? 0 : nextIndex;

            if (items.value.length > 0) {
                items.value.splice(index, 1);
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
                :item="items[currentIndex]"
                :updated="handleUpdated"
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
                        v-for="(item,index) in items"
                        :key="index"
                    >
                        <slot
                            name="label"
                            :item="item"
                            :index="index"
                            :current-index="currentIndex"
                            :label="label"
                            :pick="pick"
                            :close="close"
                        >
                            <DFormTabGroup
                                :item="item"
                                :index="index"
                                :current-index="currentIndex"
                                :label="label"
                                @picked="pick"
                                @closed="close"
                            />
                        </slot>
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
