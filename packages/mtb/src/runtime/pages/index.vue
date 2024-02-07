<script lang="ts">
import { PageMetaKey, useToast } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/MSearchForm.vue';
import type { QuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
        });

        const { showError } = useToast();

        const handleFailed = (e: ClientError) => {
            showError(e);
        };

        const handleSubmitted = async (data : QuerySession) => {
            await navigateTo({ path: `/mtb/query/${data.id}` });
        };

        return {
            handleFailed,
            handleSubmitted,
        };
    },
});
</script>

<template>
    <div class="container">
        <SearchForm
            @query-created="handleSubmitted"
            @failed="handleFailed"
        />
    </div>
</template>
