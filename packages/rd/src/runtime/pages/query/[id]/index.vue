<script lang="ts">
import {
    DNav,
    DQueryFilterContainer,
    DQueryInfoBox,
    DQueryPatientFilters,
    QueryEventBusEventName,
    injectQueryEventBus,
} from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import QueryDiagnosisFilter from '../../../components/core/RQueryDiagnosisFilter.vue';
import QueryHPOFilter from '../../../components/core/RQueryHPOFilter.vue';
import SearchForm from '../../../components/core/RSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        DQueryFilterContainer,
        DQueryInfoBox,
        QueryHPOFilter,
        QueryDiagnosisFilter,
        DQueryPatientFilters,
        SearchForm,
        DNav,
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

        const navItems = [
            {
                name: 'Überblick',
                icon: 'fa6-solid:bars',
                urlSuffix: '/summary',
            },
            {
                name: 'Patienten',
                icon: 'fa6-solid:user-injured',
                urlSuffix: '/patients',
            },
            {
                name: 'Info',
                icon: 'fa6-solid:network-wired',
                urlSuffix: '/info',
            },
        ];

        const summaryNavItems = [
            {
                name: 'Demographie',
                icon: 'fa6-solid:globe',
                urlSuffix: '',
            },
            {
                name: 'Diagnostik',
                icon: 'fa6-solid:stethoscope',
                urlSuffix: '/diagnostics',
            },
        ];

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
            <DNav
                :items="navItems"
                :path="'/rd/query/'+ entity.id"
            >
                <template #end>
                    <li class="nav-item">
                        <button
                            type="button"
                            class="nav-link"
                            @click.prevent="toggleModal"
                        >
                            <VCIcon name="fa6-solid:gear" /> Anpassen
                        </button>
                    </li>
                </template>
            </DNav>
        </div>
        <div v-if="isSummaryActive">
            <DNav
                :items="summaryNavItems"
                :path="'/rd/query/'+ entity.id + '/summary'"
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
