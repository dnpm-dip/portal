<script lang="ts">
import type { ColorVariant } from 'bootstrap-vue-next';
import { BFormTag } from 'bootstrap-vue-next';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

type Tag = {
    id: string | number,
    value: string
};
export default defineComponent({
    components: {
        BFormTag,
    },
    props: {
        modelValue: {
            type: Array as PropType<Tag[]>,
            required: true,
        },
        tagClass: {
            type: String as PropType<any>,
        },
        tagPills: {
            type: Boolean,
        },
        tagValidator: {
            type: Function as PropType<(t: string) => boolean>,
        },
        tagVariant: {
            type: String as PropType<ColorVariant>,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const items = ref<Tag[]>([]);
        items.value = props.modelValue;

        const drop = (value: string) => {
            const index = items.value.findIndex((el) => el.value === value);
            if (index !== -1) {
                items.value.splice(index, 1);
            }

            emit('update:modelValue', items);
        };

        return {
            items,
            drop,
        };
    },
});
</script>
<template>
    <slot>
        <ul class="list-unstyled mb-0 d-flex flex-wrap align-items-center">
            <template
                v-for="(item, index) in items"
                :key="index"
            >
                <slot
                    name="tag"
                    :tag="item.id"
                    :tag-class="tagClass"
                    :tag-variant="tagVariant"
                    :tag-pills="tagPills"
                    :remove-tag="drop"
                >
                    <BFormTag
                        :key="item.id"
                        :class="tagClass"
                        tag="li"
                        :variant="tagVariant"
                        :pill="tagPills"
                        @remove="drop"
                    >
                        {{ item.value }}
                    </BFormTag>
                </slot>
            </template>
        </ul>
    </slot>
</template>
