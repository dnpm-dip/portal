<script lang="ts">
import { DAPIClientError, PageMetaKey } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/MSearchForm.vue';
import type { QuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        DAPIClientError,
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
        });

        const error = ref<null | ClientError>(null);
        const handleFailed = (e: ClientError) => {
            error.value = e;
        };

        const handleSubmitted = async (data : QuerySession) => {
            error.value = null;

            await navigateTo({ path: `/mtb/query/${data.id}` });
        };

        return {
            error,
            handleSubmitted,
        };
    },
});
</script>

<template>
    <div class="container">
        <template v-if="error">
            <DAPIClientError :error="error" />
        </template>

        <SearchForm @query-created="handleSubmitted" />
    </div>
</template>
