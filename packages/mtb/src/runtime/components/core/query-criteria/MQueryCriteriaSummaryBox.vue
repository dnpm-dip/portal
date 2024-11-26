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
    setup(props, { emit }) {
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
    <div class="entity-card w-100">
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-row gap-2">
                <div>
                    <button
                        v-if="entity.criteria"
                        class="btn btn-dark btn-xs"
                        @click.prevent="toggleExtended"
                    >
                        <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                    </button>
                </div>
                <div>
                    <strong>Kriterien</strong>
                </div>
            </div>
        </div>
    </div>
</template>
