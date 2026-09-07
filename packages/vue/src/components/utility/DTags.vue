<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';

type Tag = {
    id: string | number,
    value: string
};
export default defineComponent({
    props: {
        modelValue: { type: Array as PropType<Tag[]> },
        items: { type: Array as PropType<Tag[]> },
        tagClass: { type: String },
        emitOnly: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'deleted'],
    slots: Object as SlotsType<{
        tag: Record<string, unknown>,
        between: Record<string, unknown>,
    }>,
    setup(props, { emit }) {
        const tags = ref<Tag[]>([]);

        const modelValue = toRef(props, 'modelValue');
        const value = toRef(props, 'items');

        const reset = () => {
            if (props.modelValue) {
                tags.value = props.modelValue;
            }

            if (props.items) {
                tags.value = props.items;
            }
        };

        reset();

        watch(modelValue, () => {
            reset();
        }, { deep: true });

        watch(value, () => {
            reset();
        }, { deep: true });

        const drop = (value: string) => {
            const index = tags.value.findIndex((el) => el.value === value);
            if (index !== -1) {
                if (!props.emitOnly) {
                    tags.value.splice(index, 1);
                }

                emit('deleted', tags.value[index]);
            }

            emit('update:modelValue', tags.value);
        };

        return {
            tags,
            drop,
        };
    },
});
</script>
<template>
    <slot>
        <!-- @vuecs/forms styles the chip row via a DESCENDANT selector
             (`.vc-form-select-search .vc-form-select-search-selected`), so the
             list must sit INSIDE a `.vc-form-select-search` wrapper to inherit
             the flex-wrap row layout + clickable pill styling. Both classes on
             one element (the old markup) silently dropped the row layout. -->
        <div class="vc-form-select-search">
            <ul class="vc-form-select-search-selected list-unstyled mb-0">
                <template
                    v-for="(item, index) in tags"
                    :key="item.id"
                >
                    <slot
                        name="tag"
                        :tag="item.id"
                        :tag-class="tagClass"
                        :remove-tag="drop"
                    >
                        <template v-if="index > 0">
                            <slot name="between" />
                        </template>
                        <li :key="item.id">
                            <button
                                type="button"
                                class="vc-form-select-search-selected-item"
                                :class="tagClass"
                                title="Entfernen"
                                @click.prevent="drop(item.value)"
                            >
                                {{ item.value }}
                                <span
                                    class="vc-form-select-search-selected-item-remove"
                                    aria-hidden="true"
                                >&times;</span>
                            </button>
                        </li>
                    </slot>
                </template>
            </ul>
        </div>
    </slot>
</template>
