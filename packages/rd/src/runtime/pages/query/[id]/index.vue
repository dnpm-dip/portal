<script lang="ts">
import {
    DQueryFilterContainer,
    DQueryInfoBox,
    DQueryPatientFilters,
    QueryEventBusEventName,
    injectQueryEventBus,
} from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import { defineNuxtComponent, useRoute } from '#imports';
import QueryDiagnosisFilter from '../../../components/core/RQueryDiagnosisFilter.vue';
import QueryHPOFilter from '../../../components/core/RQueryHPOFilter.vue';
import SearchForm from '../../../components/core/RSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        VCNavItems,
        DQueryFilterContainer,
        DQueryInfoBox,
        QueryHPOFilter,
        QueryDiagnosisFilter,
        DQueryPatientFilters,
        SearchForm,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    emits: ['failed', 'updated'],
    setup(props, { emit }) {
        const route = useRoute();
        const queryEventBus = injectQueryEventBus();

        const navItems = computed<NavigationItem[]>(() => [
            {
                name: 'Überblick', 
                icon: 'fa6-solid:bars', 
                url: `/rd/query/${props.entity.id}/summary`, 
            },
            {
                name: 'Patienten', 
                icon: 'fa6-solid:user-injured', 
                url: `/rd/query/${props.entity.id}/patients`, 
            },
            {
                name: 'Info', 
                icon: 'fa6-solid:network-wired', 
                url: `/rd/query/${props.entity.id}/info`, 
            },
        ]);

        const summaryNavItems = computed<NavigationItem[]>(() => [
            {
                name: 'Demographie', 
                icon: 'fa6-solid:globe', 
                url: `/rd/query/${props.entity.id}/summary`, 
            },
            {
                name: 'Diagnostik', 
                icon: 'fa6-solid:stethoscope', 
                url: `/rd/query/${props.entity.id}/summary/diagnostics`, 
            },
        ]);

        const isSummaryActive = computed(() => route.path.startsWith(`/rd/query/${props.entity.id}/summary`));

        const handleSubmit = () => {
            // do nothing
        };

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);

            queryEventBus.emit(QueryEventBusEventName.SESSION_UPDATED, entity, 'mtb');
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const modal = ref(false);
        const toggleModal = () => {
            modal.value = !modal.value;
        };

        const handleModalUpdated = (entity: QuerySession) => {
            handleUpdated(entity);

            modal.value = false;
        };

        return {
            handleSubmit,

            handleUpdated,
            handleFailed,

            toggleModal,
            modal,
            handleModalUpdated,

            navItems,
            summaryNavItems,
            isSummaryActive,
            preparedQueryId: route.query.preparedQueryId,
        };
    },
});
</script>
<template>
    <div class="flex flex-row mb-2">
        <div>
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/rd/'"
                >
                    <VCIcon name="fa6-solid:arrow-left" />
                </NuxtLink>
                Abfrage
            </h4>
        </div>
    </div>

    <div class="flex flex-col gap-2 mb-2">
        <div>
            <div class="flex flex-row items-center gap-2">
                <VCNavItems
                    :data="navItems"
                    variant="pills"
                />
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click.prevent="toggleModal"
                >
                    <VCIcon name="fa6-solid:gear" /> Anpassen
                </button>
            </div>
        </div>
        <div v-if="isSummaryActive">
            <VCNavItems
                :data="summaryNavItems"
                variant="pills"
            />
        </div>
    </div>

    <hr>

    <DQueryInfoBox
        :entity="entity"
        :link="'/rd/query/' + entity.id + '/info'"
    />

    <template v-if="entity">
        <div class="row">
            <div class="col-6 col-md-9 col-lg-10">
                <NuxtPage
                    :entity="entity"
                    @updated="handleUpdated"
                />
            </div>
            <div class="col-6 col-md-3 col-lg-2">
                <DQueryFilterContainer>
                    <template #default>
                        <DQueryPatientFilters
                            class="mb-3"
                            :query-id="entity.id"
                            :use-case="'rd'"
                            @submit="handleSubmit"
                        />

                        <QueryDiagnosisFilter
                            class="mb-3"
                            :query-id="entity.id"
                            @submit="handleSubmit"
                        />

                        <QueryHPOFilter
                            class="mb-3"
                            :query-id="entity.id"
                            @submit="handleSubmit"
                        />
                    </template>
                </DQueryFilterContainer>
            </div>
        </div>

        <VCModal v-model:open="modal">
            <VCModalContent class="modal-lg">
                <div class="modal-header">
                    <div class="flex flex-row w-full">
                        <div>
                            <h5 class="mb-0">
                                <VCIcon name="fa6-solid:magnifying-glass" /> Suche
                            </h5>
                        </div>
                        <div class="ms-auto">
                            <button
                                type="button"
                                class="btn btn-xs btn-secondary"
                                @click.prevent="modal = false"
                            >
                                <VCIcon name="fa6-solid:xmark" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <SearchForm
                        :query-mode="entity.mode.code"
                        :query-peers="entity.peers"
                        :query-id="entity.id"
                        :criteria="entity.criteria"
                        :prepared-query-id="preparedQueryId"
                        @query-updated="handleModalUpdated"
                        @failed="handleFailed"
                    />
                </div>
            </VCModalContent>
        </VCModal>
    </template>
</template>
