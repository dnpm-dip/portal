<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { DNav, DQueryPatientFilters } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { provide, ref } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import QueryDiagnosisFilter from '../../../components/core/QueryDiagnosisFilter.vue';
import QueryHPOFilter from '../../../components/core/QueryHPOFilter.vue';
import SearchForm from '../../../components/core/SearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
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
                name: 'Anpassen', icon: 'fa fa-cog', urlSuffix: '/settings',
            },
        ];

        const queryFilters = ref<URLQueryRecord>({});
        provide('queryFilters', queryFilters);

        const applyFilters = (input: URLQueryRecord) => {
            queryFilters.value = {
                ...queryFilters.value,
                ...input,
            };
        };

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);
        };

        return {
            applyFilters,
            handleUpdated,
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
        />
    </div>

    <hr>

    <template v-if="entity">
        <div class="row">
            <div class="col-9">
                <NuxtPage
                    :entity="entity"
                    @updated="handleUpdated"
                />
            </div>
            <div class="col-3">
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
    </template>
</template>
