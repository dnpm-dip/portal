<script lang="ts">
import { APIClientErrorBox, PageMetaKey } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import { defineNuxtComponent, navigateTo } from '#app';
import SearchForm from '../components/SearchForm.vue';
import type { RDQuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        APIClientErrorBox,
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
        });

        const error = ref<null | ClientError>(null);
        const handleFailed = (e: ClientError) => {
            error.value = e;
        };

        const handleCreated = async (data: RDQuerySession) => {
            error.value = null;

            await navigateTo({ path: `/rd/query/${data.id}` });
        };

        return {
            error,
            handleCreated,
            handleFailed,
        };
    },
});
</script>

<template>
    <div>
        <h1 class="mb-3">
            <i class="fa fa-search" /> Suche
        </h1>

        <SearchForm
            @created="handleCreated"
            @failed="handleFailed"
        />

        <template v-if="error">
            <APIClientErrorBox :error="error" />
        </template>
    </div>
</template>
