<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { BModal } from 'bootstrap-vue-next';
import { type PropType, defineComponent, ref } from 'vue';
import type { QuerySession } from '../../../domains';
import MSearchForm from '../search/MSearchForm.vue';

export default defineComponent({
    components: { BModal, MSearchForm },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
        preparedQueryId: {
            type: String,
        },
    },
    emits: ['updated', 'failed'],
    setup(props, { emit }) {
        const modal = ref(false);
        const toggleModal = () => {
            modal.value = !modal.value;
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const handleModalUpdated = (entity: QuerySession) => {
            emit('updated', entity);
            modal.value = false;
        };

        return {
            modal,
            toggleModal,

            handleFailed,
            handleModalUpdated,
        };
    },
});
</script>
<template>
    <slot
        name="default"
        :toggle="toggleModal"
    >
        <NuxtLink
            class="btn btn-xs btn-primary ms-1"
            @click.prevent="toggleModal"
        >
            <i class="fa-solid fa-cog" />
        </NuxtLink>
    </slot>

    <BModal
        v-model="modal"
        :hide-footer="true"
        :size="'lg'"
    >
        <template #header="props">
            <div class="d-flex flex-row w-100">
                <div>
                    <h5 class="mb-0">
                        <i class="fa fa-search" /> Suche
                    </h5>
                </div>
                <div class="ms-auto">
                    <button
                        type="button"
                        class="btn btn-xs btn-secondary"
                        @click.prevent="props.close()"
                    >
                        <i class="fa fa-times" />
                    </button>
                </div>
            </div>
        </template>
        <MSearchForm
            :query-mode="entity.mode.code"
            :query-peers="entity.peers"
            :query-id="entity.id"
            :criteria="entity.criteria"
            :prepared-query-id="preparedQueryId"
            @query-updated="handleModalUpdated"
            @failed="handleFailed"
        />
    </BModal>
</template>
