<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { storeToRefs } from '@authup/client-web-kit';
import { defineComponent } from 'vue';
import { useQueryFilterStore } from '../../../stores';

export default defineComponent({
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
    <div class="d-flex flex-column gap-1">
        <slot name="default" />

        <div class="entity-card">
            <button
                type="button"
                class="btn btn-sm btn-block"
                :class="dirty ? 'btn-primary' : 'btn-secondary'"
                :disabled="!dirty"
                @click.prevent="submit"
            >
                Anwenden
            </button>
        </div>
    </div>
</template>
