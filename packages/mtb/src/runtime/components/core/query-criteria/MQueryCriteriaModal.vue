<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { VCButton } from '@vuecs/button';
import { type PropType, defineComponent, ref } from 'vue';
import type { QuerySession } from '../../../domains';
import MSearchForm from '../search/MSearchForm.vue';

export default defineComponent({
    components: { MSearchForm, VCButton },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
        preparedQueryId: { type: String },
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

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);
            modal.value = false;
        };

        return {
            modal,
            toggleModal,

            handleFailed,
            handleUpdated,
        };
    },
});
</script>
<template>
    <slot
        name="default"
        :toggle="toggleModal"
    >
        <VCButton
            color="primary"
            size="xs"
            class="ms-1"
            @click.prevent="toggleModal"
        >
            <VCIcon name="fa6-solid:gear" />
        </VCButton>
    </slot>

    <VCModal v-model:open="modal">
        <VCModalContent class="modal-lg">
            <div class="flex items-center justify-between border-b border-border px-4 py-3">
                <div class="flex flex-row w-full">
                    <div>
                        <h5 class="mb-0">
                            <VCIcon name="fa6-solid:magnifying-glass" /> Suche
                        </h5>
                    </div>
                    <div class="ms-auto">
                        <VCButton
                            type="button"
                            color="neutral"
                            variant="soft"
                            size="xs"
                            @click.prevent="modal = false"
                        >
                            <VCIcon name="fa6-solid:xmark" />
                        </VCButton>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3">
                <MSearchForm
                    :query-mode="entity.mode.code"
                    :query-peers="entity.peers"
                    :query-id="entity.id"
                    :criteria="entity.criteria"
                    :prepared-query-id="preparedQueryId"
                    @updated="handleUpdated"
                    @failed="handleFailed"
                />
            </div>
        </VCModalContent>
    </VCModal>
</template>
