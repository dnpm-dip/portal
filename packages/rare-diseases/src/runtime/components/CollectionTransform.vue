<script lang="ts">
import { hasNormalizedSlot, normalizeSlot } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { computed, defineComponent, h } from 'vue';

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
    setup(props, { emit, slots }) {
        const codings = computed(() => {
            if (!props.items.length) {
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
            return () => normalizeSlot('default', codings.value, slots);
        }

        return () => h('div', []);
    },
});
</script>
