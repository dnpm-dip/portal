<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { FormTab } from './types';

export default defineComponent({
    props: {
        item: {
            type: Object as PropType<FormTab>,
            required: true,
        },
        currentIndex: {
            type: Number,
        },
        minItems: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
    },
    emits: ['picked', 'closed'],
    setup(props, { emit }) {
        const text = computed(() => {
            if (props.item.label) {
                return props.item.label;
            }

            return `${(props.item.index ?? 0) + 1}`;
        });

        const isEmpty = computed(() => props.item.data === null);

        const pick = () => {
            emit('picked', props.item.index);
        };

        const close = () => {
            emit('closed', props.item.index);
        };

        return {
            isEmpty,
            text,

            close,
            pick,
        };
    },
});
</script>
<template>
    <li
        class="form-tab gap-2"
        :class="{'active': currentIndex === item.index }"
    >
        <div
            class="form-tab-text"
            @click.prevent="pick"
        >
            <template v-if="isEmpty">
                <slot
                    name="empty"
                    :data="item"
                    :current-index="currentIndex"
                    :pick="pick"
                >
                    {{ text }}
                </slot>
            </template>
            <template v-else>
                <slot
                    :data="item"
                    :current-index="currentIndex"
                    :pick="pick"
                >
                    {{ text }}
                </slot>
            </template>
        </div>
        <div class="ms-auto">
            <a
                v-if="minItems < totalItems || !isEmpty"
                href="javascript:void(0)"
                class="nav-link text-center"
                @click="close"
            >
                <i class="fa fa-times" />
            </a>
        </div>
    </li>
</template>
