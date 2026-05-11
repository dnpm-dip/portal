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
        active: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['reset'],
    setup(props, { emit }) {
        const store = useQueryFilterStore();
        const storeRefs = storeToRefs(store);

        const extended = computed(() => storeRefs.active.value === props.name);

        const toggleExtended = () => {
            store.setActive(props.name);
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
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-row align-items-center">
                <div>
                    <h6 class="text-muted mb-0">
                        <slot name="title">
                            Filter
                        </slot>
                        <i
                            v-if="active"
                            class="fa fa-circle text-success ms-1"
                            style="font-size: 0.5em; vertical-align: middle;"
                            aria-label="Filter aktiv"
                        />
                    </h6>
                </div>
                <div class="ms-auto d-flex gap-1">
                    <button
                        v-if="active"
                        class="btn btn-secondary btn-xs"
                        title="Filter zurücksetzen"
                        @click.prevent="reset"
                    >
                        <i class="fa fa-rotate-left" />
                    </button>
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
