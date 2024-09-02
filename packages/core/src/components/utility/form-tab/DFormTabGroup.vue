<script lang="ts">
import { computed, defineComponent } from 'vue';
import { template } from '../../../utils';

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
    emits: ['toggle'],
    setup(props, { emit }) {
        const text = computed(() => {
            if (props.label) {
                return template(props.label, {
                    ...props.item,
                    index: props.index,
                    position: props.index + 1,
                });
            }

            return `${props.index + 1}`;
        });

        const toggle = () => {
            emit('toggle', props.index);
        };

        return {
            text,
            toggle,
        };
    },
});
</script>
<template>
    <li
        class="nav-item"
        style="max-width: 150px;"
    >
        <a
            href="javascript:void(0)"
            class="nav-link text-center"
            :class="{'router-link-exact-active': currentIndex === index}"
            @click="toggle"
        >
            <slot
                :item="item"
                :index="index"
                :current-index="currentIndex"
                :toggle="toggle"
            >
                {{ text }}
            </slot>
        </a>
    </li>
</template>
