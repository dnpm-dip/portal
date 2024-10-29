<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const extended = ref(true);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

        return {
            extended,
            toggleExtended,
        };
    },
});
</script>
<template>
    <div class="entity-card">
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-row">
                <div>
                    <slot name="title">
                        Filter
                    </slot>
                </div>
                <div class="ms-auto">
                    <button
                        class="btn btn-dark btn-xs"
                        @click.prevent="toggleExtended"
                    >
                        <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                    </button>
                </div>
            </div>
            <div v-show="extended">
                <slot name="default" />
            </div>
        </div>
    </div>
</template>
