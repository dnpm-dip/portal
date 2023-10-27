<script lang="ts">
import { hasNormalizedSlot, normalizeSlot } from '@dnpm-dip/core';
import type { ValueSet } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { computed, defineComponent, h } from 'vue';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<ValueSet>,
        },
        transform: {
            type: Function,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit, slots }) {
        const codings = computed(() => props.entity.codings.map((coding) => {
            if (typeof props.transform === 'function') {
                return props.transform(coding);
            }

            return coding;
        }));

        if (hasNormalizedSlot('default', slots)) {
            return () => normalizeSlot('default', codings.value, slots);
        }

        return () => h('div', []);
    },
});
</script>
