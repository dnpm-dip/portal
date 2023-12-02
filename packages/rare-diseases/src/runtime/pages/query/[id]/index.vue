<script lang="ts">
import type { URLQueryRecord } from '@dnpm-dip/core';
import { Nav } from '@dnpm-dip/core';
import type { PropType } from 'vue';
import { provide, ref } from 'vue';
import { defineNuxtComponent } from '#imports';
import SearchForm from '../../../components/core/SearchForm.vue';
import type { RDQuerySession } from '../../../domains';

export default defineNuxtComponent({
    components: {
        SearchForm,
        Nav,
    },
    props: {
        entity: {
            type: Object as PropType<RDQuerySession>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const navItems = [
            {
                name: 'Überblick', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Patienten', icon: 'fas fa-user-injured', urlSuffix: '/patients',
            },
            {
                name: 'Einstellungen', icon: 'fa fa-cog', urlSuffix: '/settings',
            },
        ];

        const queryFilters = ref<URLQueryRecord>({});

        provide('queryFilters', queryFilters);

        const displayed = ref(false);
        const toggleDisplay = () => {
            displayed.value = !displayed.value;
        };

        const handleUpdated = (entity: RDQuerySession) => {
            emit('updated', entity);
        };

        return {
            handleUpdated,
            navItems,
            displayed,
            toggleDisplay,
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
                    :to="'/rd/search'"
                >
                    <i class="fa fa-arrow-left" />
                </NuxtLink>
                Abfrage
            </h4>
        </div>
        <div class="ms-auto">
            <button
                type="button"
                class="btn btn-secondary btn-xs"
                @click.prevent="toggleDisplay"
            >
                <i class="fa fa-cog" />
            </button>
        </div>
    </div>

    <div class="mb-2">
        <Nav
            :items="navItems"
            :path="'/rd/query/'+ entity.id"
        />
    </div>

    <hr>

    <template v-if="displayed">
        <div class="entity-card">
            <SearchForm
                :entity="entity"
                @updated="handleUpdated"
            />
        </div>
        <hr>
    </template>

    <template v-if="entity">
        <NuxtPage
            :entity="entity"
            @updated="handleUpdated"
        />
    </template>
</template>
