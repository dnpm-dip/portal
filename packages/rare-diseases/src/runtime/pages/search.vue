<script lang="ts">
import { APIClientErrorBox, PageMetaKey } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import { defineNuxtComponent, navigateTo } from '#app';
import SearchForm from '../components/core/SearchForm.vue';
import SearchSVG from '../components/svg/SearchSVG';
import type { RDQuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        SearchSVG,
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
    <div class="container">
        <div class="text-center">
            <SearchSVG :height="'250px'" />
        </div>

        <SearchForm
            @created="handleCreated"
            @failed="handleFailed"
        />

        <template v-if="error">
            <APIClientErrorBox :error="error" />
        </template>
    </div>
</template>
