<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { DNav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { provide, ref } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import SearchForm from '../../../components/core/MSearchForm.vue';
import type { QuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        SearchForm,
        DNav,
    },
    props: {
        entity: {
            type: Object as PropType<QuerySession>,
            required: true,
        },
    },
    setup(_, { emit }) {
        const route = useRoute();

        const navItems = [
            {
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Einstellungen', icon: 'fa fa-cog', urlSuffix: '/settings',
            },
        ];

        const queryFilters = ref<URLQueryRecord>({});

        provide('queryFilters', queryFilters);

        const handleUpdated = (entity: QuerySession) => {
            emit('updated', entity);
        };

        return {
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
                    :to="'/mtb/'"
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
            :path="'/mtb/query/'+ entity.id"
        />
    </div>

    <hr>

    <template v-if="entity">
        <NuxtPage
            :entity="entity"
            @updated="handleUpdated"
        />
    </template>
</template>
