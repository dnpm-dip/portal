<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    props: {
        index: {
            type: Number,
            required: true,
        },
        item: {
            type: Object,
            required: true,
        },
        currentIndex: {
            type: Number,
        },
        label: {
            type: String,
        },
    },
    emits: ['picked', 'closed'],
    setup(props, { emit }) {
        const text = computed(() => {
            if (props.label) {
                return props.label;
            }

            return `${props.index + 1}`;
        });

        const isEmpty = computed(() => Object.keys(props.item).length === 0);

        const pick = () => {
            emit('picked', props.index);
        };

        const close = () => {
            emit('closed', props.index);
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
        :class="{'active': currentIndex === index }"
    >
        <div
            class="form-tab-text"
            @click.prevent="pick"
        >
            <template v-if="isEmpty">
                <slot
                    name="empty"
                    :item="item"
                    :index="index"
                    :current-index="currentIndex"
                    :pick="pick"
                >
                    {{ text }}
                </slot>
            </template>
            <template v-else>
                <slot
                    :item="item"
                    :index="index"
                    :current-index="currentIndex"
                    :pick="pick"
                >
                    {{ text }}
                </slot>
            </template>
        </div>
        <div class="ms-auto">
            <a
                href="javascript:void(0)"
                class="nav-link text-center"
                @click="close"
            >
                <i class="fa fa-times" />
            </a>
        </div>
    </li>
</template>
