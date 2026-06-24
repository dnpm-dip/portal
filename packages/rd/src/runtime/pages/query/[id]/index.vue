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

            queryEventBus.emit(QueryEventBusEventName.SESSION_UPDATED, entity, 'rd');
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
    <header class="mb-4 flex items-center gap-4">
        <span
            class="flex size-12 shrink-0 items-center justify-center rounded-xl
                   bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
        >
            <VCIcon name="fa6-solid:magnifying-glass-chart" />
        </span>
        <div class="min-w-0">
            <h1 class="mb-0 text-2xl font-bold tracking-tight">
                Abfrage
            </h1>
            <p class="mb-0 text-sm text-fg-muted">
                Seltene Erkrankungen
            </p>
        </div>
        <VCButton
            tag="nuxt-link"
            :to="'/rd/'"
            size="sm"
            color="neutral"
            variant="soft"
            class="ms-auto"
        >
            <VCIcon name="fa6-solid:arrow-left" />
            Zur Suche
        </VCButton>
    </header>

    <div class="flex flex-col gap-2 mb-2">
        <div>
            <div class="flex flex-row items-center gap-2">
                <VCNavItems
                    :data="navItems"
                    variant="pills"
                />
                <VCButton
                    type="button"
                    size="sm"
                    color="neutral"
                    variant="soft"
                    @click.prevent="toggleModal"
                >
                    <VCIcon name="fa6-solid:gear" /> Anpassen
                </VCButton>
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
        <div class="flex flex-wrap -mx-2">
            <div class="w-6/12 px-2 md:w-9/12 lg:w-10/12">
                <NuxtPage
                    :entity="entity"
                    @updated="handleUpdated"
                />
            </div>
            <div class="w-6/12 px-2 md:w-3/12 lg:w-2/12">
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
                                size="xs"
                                color="neutral"
                                variant="soft"
                                @click.prevent="modal = false"
                            >
                                <VCIcon name="fa6-solid:xmark" />
                            </VCButton>
                        </div>
                    </div>
                </div>
                <div class="px-4 py-3">
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
