<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { storeToRefs } from '@authup/client-web-kit';
import { VCButton } from '@vuecs/button';
import { defineComponent } from 'vue';
import { useQueryFilterStore } from '../../../stores';

export default defineComponent({
    components: { VCButton },
    emits: ['submitted'],
    setup(_props, { emit }) {
        const store = useQueryFilterStore();
        const { dirty } = storeToRefs(store);

        const submit = () => {
            store.commit();

            emit('submitted');
        };

        return { submit, dirty };
    },
});
</script>
<template>
    <div class="flex flex-col gap-1">
        <slot name="default" />

        <div class="entity-card">
            <VCButton
                type="button"
                size="sm"
                class="w-full"
                :color="dirty ? 'primary' : 'neutral'"
                :variant="dirty ? undefined : 'soft'"
                :disabled="!dirty"
                @click.prevent="submit"
            >
                Anwenden
            </VCButton>
        </div>
    </div>
</template>
