<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent } from 'vue';
import { useQueryFilterStore } from '../../../stores';

export default defineComponent({
    emits: ['submitted'],
    setup(props, { emit }) {
        const store = useQueryFilterStore();

        const submit = () => {
            store.commit();

            emit('submitted');
        };

        return {
            submit,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-column gap-1">
        <slot name="default" />

        <div class="entity-card">
            <button
                type="button"
                class="btn btn-sm btn-primary btn-block"
                @click.prevent="submit"
            >
                Anwenden
            </button>
        </div>
    </div>
</template>
