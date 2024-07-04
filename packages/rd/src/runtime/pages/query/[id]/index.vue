<script lang="ts">
import { DQueryInfoBox, InjectionKey, type URLQueryRecord } from '@dnpm-dip/core';
import { DNav, DQueryPatientFilters } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { BModal } from 'bootstrap-vue-next';
import { provide, ref } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import QueryDiagnosisFilter from '../../../components/core/RQueryDiagnosisFilter.vue';
import QueryHPOFilter from '../../../components/core/RQueryHPOFilter.vue';
import SearchForm from '../../../components/core/RSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        BModal,
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
    setup(props, { emit }) {
        const route = useRoute();

        const navItems = [
            {
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Patienten', icon: 'fas fa-user-injured', urlSuffix: '/patients',
            },
            {
                name: 'Info', icon: 'fa fa-network-wired', urlSuffix: '/info',
            },
        ];

        const queryFilters = ref<URLQueryRecord>({});
        provide(InjectionKey.QUERY_FILTERS, queryFilters);

        const queryUpdatedAt = ref(props.entity.lastUpdate);
        provide(InjectionKey.QUERY_UPDATED_AT, queryUpdatedAt);

        const applyFilters = (input: URLQueryRecord) => {
            queryFilters.value = {
                ...queryFilters.value,
                ...input,
            };
        };

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);

            queryUpdatedAt.value = entity.lastUpdate;
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
            applyFilters,

            handleUpdated,
            handleFailed,

            toggleModal,
            modal,
            handleModalUpdated,

            navItems,
            preparedQueryId: route.query.preparedQueryId,
        };
    },
});
</script>
<template>
    <div class="d-flex flex-row mb-2">
        <div>
            <h4>
                <NuxtLink
                    class="btn btn-xs btn-dark me-1"
                    :to="'/rd/'"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Abfrage
            </h4>
        </div>
    </div>

    <div class="mb-2">
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
                        <i class="fa fa-cog" /> Anpassen
                    </button>
                </li>
            </template>
        </DNav>
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
                <DQueryPatientFilters
                    class="mb-3"
                    :available-filters="entity.filters.patientFilter"
                    @submit="applyFilters"
                />

                <QueryDiagnosisFilter
                    class="mb-3"
                    :available-filters="entity.filters.diagnosisFilter"
                    @submit="applyFilters"
                />

                <QueryHPOFilter
                    class="mb-3"
                    :available-filters="entity.filters.hpoFilter"
                    @submit="applyFilters"
                />
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

            <SearchForm
                :query-mode="entity.mode.code"
                :query-id="entity.id"
                :criteria="entity.criteria"
                :prepared-query-id="preparedQueryId"
                @query-updated="handleModalUpdated"
                @failed="handleFailed"
            />
        </BModal>
    </template>
</template>
