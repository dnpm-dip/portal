<script lang="ts">
import type { PropType, SlotsType } from 'vue';
import {
    computed,
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';

type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | null;
type Tag = {
    id: string | number,
    value: string
};
export default defineComponent({
    props: {
        modelValue: { type: Array as PropType<Tag[]> },
        items: { type: Array as PropType<Tag[]> },
        tagClass: { type: String },
        tagPills: { type: Boolean },
        tagValidator: { type: Function as PropType<(t: string) => boolean> },
        tagVariant: { type: String as PropType<ColorVariant> },
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

        /*
         * The bg-* variant aliases pin mode-stable fills (see the theme's
         * compat layer), so the chip text and close glyph must be pinned
         * to match: a flipping token (text-fg-muted) turns invisible on a
         * pinned-light fill in dark mode. No variant → mode-flipping
         * bg-bg-muted, and text/glyph inherit the flipping defaults.
         */
        const variantClasses = computed(() => {
            if (!props.tagVariant) {
                return { badge: 'bg-bg-muted', close: '' };
            }

            const lightFill = props.tagVariant === 'light' || props.tagVariant === 'warning';
            return {
                badge: `bg-${props.tagVariant} ${lightFill ? 'text-neutral-900' : 'text-white'}`,
                close: lightFill ? 'text-neutral-900' : 'btn-close-white',
            };
        });

        return {
            tags,
            drop,
            variantClasses,
        };
    },
});
</script>
<template>
    <slot>
        <ul class="list-unstyled mb-0 flex flex-wrap items-center">
            <template
                v-for="(item, index) in tags"
                :key="item.id"
            >
                <slot
                    name="tag"
                    :tag="item.id"
                    :tag-class="tagClass"
                    :tag-variant="tagVariant"
                    :tag-pills="tagPills"
                    :remove-tag="drop"
                >
                    <template v-if="index > 0">
                        <slot name="between" />
                    </template>
                    <li
                        :key="item.id"
                        class="badge mt-1 inline-flex items-center"
                        :class="[
                            tagClass,
                            variantClasses.badge,
                            { 'rounded-pill': tagPills },
                        ]"
                    >
                        {{ item.value }}
                        <button
                            type="button"
                            class="btn-close ms-1"
                            :class="variantClasses.close"
                            aria-label="Remove"
                            @click.prevent="drop(item.value)"
                        />
                    </li>
                </slot>
            </template>
        </ul>
    </slot>
</template>
