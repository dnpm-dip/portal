<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { DNav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { provide, ref } from 'vue';
import { defineNuxtComponent, useRoute } from '#imports';
import SearchForm from '../../../components/core/SearchForm.vue';
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
        <NuxtPage
            :entity="entity"
            @updated="handleUpdated"
        />
    </template>
</template>
