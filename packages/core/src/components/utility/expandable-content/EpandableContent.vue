<script lang="ts">
import {
    defineComponent, 
    ref, 
    toRef, 
    watch,
} from 'vue';

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const expanded = ref(false);

        const propRef = toRef(props, 'modelValue');
        watch(propRef, (value) => {
            expanded.value = value;
        });

        expanded.value = propRef.value;

        const toggleExtended = () => {
            expanded.value = !expanded.value;

            emit('update:modelValue', expanded.value);
        };

        return {
            toggleExtended,
            extended: expanded,
        };
    },
});
</script>
<template>
    <div>
        <div class="flex flex-row">
            <div>
                <slot name="header">
                    Header
                </slot>
            </div>
            <div class="ms-auto">
                <button
                    class="btn btn-dark btn-xs"
                    @click.prevent="toggleExtended"
                >
                    <VCIcon :name="extended ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                </button>
            </div>
        </div>
    </div>
    <template v-if="extended">
        <slot name="default" />
    </template>
</template>
