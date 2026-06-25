<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { VCButton } from '@vuecs/button';
import { VCIcon } from '@vuecs/icon';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    components: { VCButton, VCIcon },
    props: {
        name: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['reset'],
    setup(_props, { emit }) {
        // const store = useQueryFilterStore();
        // const storeRefs = storeToRefs(store);

        // const extended = computed(() => storeRefs.active.value === props.name);
        const extended = ref(false);

        const toggleExtended = () => {
            // store.setActive(props.name);
            extended.value = !extended.value;
        };

        const reset = () => {
            emit('reset');
        };

        return {
            extended,
            toggleExtended,
            reset,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row items-center">
                <div>
                    <h6 class="text-fg-muted mb-0">
                        <slot name="title">
                            Filter
                        </slot>
                        <VCIcon
                            v-if="active"
                            name="fa6-solid:circle"
                            class="text-success-600 ms-1"
                            style="font-size: 0.5em; vertical-align: middle;"
                            role="img"
                            aria-label="Filter aktiv"
                        />
                    </h6>
                </div>
                <div class="ms-auto flex gap-1">
                    <VCButton
                        type="button"
                        size="xs"
                        :color="active ? 'error' : 'neutral'"
                        :variant="active ? undefined : 'soft'"
                        :disabled="!active"
                        title="Filter zurücksetzen"
                        aria-label="Filter zurücksetzen"
                        @click.prevent="reset"
                    >
                        <VCIcon name="fa6-solid:rotate-left" />
                    </VCButton>
                    <VCButton
                        type="button"
                        color="neutral"
                        size="xs"
                        :title="extended ? 'Filter ausgeklappt' : 'Filter ausklappen'"
                        :aria-label="extended ? 'Filter ausgeklappt' : 'Filter ausklappen'"
                        @click.prevent="toggleExtended"
                    >
                        <VCIcon :name="extended ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                    </VCButton>
                </div>
            </div>
            <div v-show="extended">
                <slot name="default" />
            </div>
        </div>
    </div>
</template>
