<template>
    <slot
        name="default"
        :entry="entry"
        :active="active"
    >
        {{ entry.id }}
    </slot>
</template>
<script lang="ts">
import type { FormSelectOption } from '@vue-layout/form-controls';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    props: {
        entry: {
            type: Object as PropType<FormSelectOption>,
            required: true,
        },
        selected: {
            type: Array as PropType<FormSelectOption[]>,
        },
    },
    setup(props) {
        const active = computed(() => props.selected && props.selected.findIndex((el) => el.id === props.entry.id) !== -1);

        return {
            active,
        };
    },
});
</script>
