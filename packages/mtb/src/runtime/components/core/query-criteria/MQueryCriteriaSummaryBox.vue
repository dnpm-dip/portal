<!--
  - Copyright (c) 2024-2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { type PropType, defineComponent, ref } from 'vue';
import type { QuerySession } from '../../../domains';

export default defineComponent({
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup() {
        const extended = ref(false);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

        return {
            toggleExtended,
            extended,
        };
    },
});
</script>
<template>
    <div class="entity-card w-full">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
                <div>
                    <VCButton
                        v-if="entity.criteria"
                        color="neutral"
                        size="xs"
                        @click.prevent="toggleExtended"
                    >
                        <VCIcon :name="extended ? 'fa6-solid:chevron-up' : 'fa6-solid:chevron-down'" />
                    </VCButton>
                </div>
                <div>
                    <strong>Kriterien</strong>
                </div>
            </div>
        </div>
    </div>
</template>
