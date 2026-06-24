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
        <!-- The @vuecs/forms chip rules are scoped under
             .vc-form-select-search, so the list carries that scope class —
             this renders standalone tags identical to the select-search
             chips (clickable pill removes the item). -->
        <ul class="vc-form-select-search vc-form-select-search-selected list-unstyled mb-0">
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
    </slot>
</template>
