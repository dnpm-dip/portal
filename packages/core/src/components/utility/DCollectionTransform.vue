<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, h } from 'vue';
import { hasNormalizedSlot, normalizeSlot } from '../../core';

export default defineComponent({
    props: {
        items: {
            type: Array as PropType<Record<string, any>[]>,
            required: true,
        },
        transform: {
            type: Function,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { slots }) {
        const items = computed(() => {
            if (!props.items.length || !Array.isArray(props.items)) {
                return [];
            }

            return props.items.map((coding) => {
                if (typeof props.transform === 'function') {
                    return props.transform(coding);
                }

                return coding;
            });
        });

        if (hasNormalizedSlot('default', slots)) {
            return () => normalizeSlot('default', items.value, slots);
        }

        return () => h('div', []);
    },
});
</script>
