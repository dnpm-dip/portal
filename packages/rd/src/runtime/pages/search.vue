<script lang="ts">
import { DAPIClientError, PageMetaKey } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/SearchForm.vue';
import SearchSVG from '../components/svg/SearchSVG';
import type { RDQueryCriteria } from '../domains';
import PreparedQueryForm from '../components/core/PreparedQueryForm.vue';

export default defineNuxtComponent({
    components: {
        PreparedQueryForm,
        SearchSVG,
        DAPIClientError,
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

        const handleSubmitted = async (data : {
            criteria: RDQueryCriteria,
            queryId: string,
            preparedQueryId?: string
        }) => {
            error.value = null;

            let query : Record<string, any> | undefined;
            if (data.preparedQueryId) {
                query = {
                    preparedQueryId: data.preparedQueryId,
                };
            }

            await navigateTo({ path: `/rd/query/${data.queryId}`, query });
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
        <div class="text-center">
            <SearchSVG :height="'250px'" />
        </div>

        <PreparedQueryForm
            @submitted="handleSubmitted"
        />

        <template v-if="error">
            <DAPIClientError :error="error" />
        </template>
    </div>
</template>
