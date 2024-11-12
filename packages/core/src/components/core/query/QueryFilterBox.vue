<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { storeToRefs } from '@authup/client-web-kit';
import { computed, defineComponent } from 'vue';
import { useQueryFilterStore } from '../../../stores';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const store = useQueryFilterStore();
        const storeRefs = storeToRefs(store);

        const extended = computed(() => storeRefs.active.value === props.name);

        const toggleExtended = () => {
            store.setActive(props.name);
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
                    <h6 class="text-muted mb-0">
                        <slot name="title">
                            Filter
                        </slot>
                    </h6>
                </div>
                <div class="ms-auto">
                    <button
                        class="btn btn-dark btn-xs"
                        :disabled="extended"
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
