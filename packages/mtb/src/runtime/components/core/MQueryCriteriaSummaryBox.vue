<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { BModal } from 'bootstrap-vue-next';
import { type PropType, defineComponent, ref } from 'vue';
import type { QuerySession } from '../../domains';
import MQueryCriteriaSummary from './MQueryCriteriaSummary.vue';
import MSearchForm from './MSearchForm.vue';

export default defineComponent({
    components: { BModal, MQueryCriteriaSummary, MSearchForm },
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
        const extended = ref(false);

        const toggleExtended = () => {
            extended.value = !extended.value;
        };

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
            toggleExtended,
            extended,

            modal,
            toggleModal,

            handleFailed,
            handleModalUpdated,
        };
    },
});
</script>
<template>
    <div class="entity-card w-100">
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-row">
                <div>
                    <strong><i class="fa fa-search" /> Suchkriterien</strong>
                </div>
                <div class="ms-auto">
                    <button
                        v-if="entity.criteria"
                        class="btn btn-dark btn-xs"
                        @click.prevent="toggleExtended"
                    >
                        <i :class="{'fa fa-chevron-down': !extended, 'fa fa-chevron-up': extended}" />
                    </button>

                    <NuxtLink
                        class="btn btn-xs btn-primary ms-1"
                        @click.prevent="toggleModal"
                    >
                        <i class="fa-solid fa-cog" />
                    </NuxtLink>
                </div>
            </div>
            <div v-show="!!entity.criteria && extended">
                <MQueryCriteriaSummary :entity="entity.criteria" />
            </div>
        </div>

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
    </div>
</template>
