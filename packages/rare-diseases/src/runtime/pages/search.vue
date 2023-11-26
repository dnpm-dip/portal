<script lang="ts">
import { APIClientErrorBox, PageMetaKey } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { ref } from 'vue';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/SearchForm.vue';
import SearchSVG from '../components/svg/SearchSVG';
import type { RDPreparedQuery, RDQuerySession } from '../domains';
import PreparedQueryForm from '../components/core/PreparedQueryForm.vue';

export default defineNuxtComponent({
    components: {
        PreparedQueryForm,
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

        const handleCreated = async (data : {query: RDQuerySession, preparedQuery?: RDPreparedQuery}) => {
            error.value = null;

            let query : Record<string, any> | undefined;
            if (data.preparedQuery) {
                query = {
                    preparedQueryId: data.preparedQuery.id,
                };
            }

            await navigateTo({ path: `/rd/query/${data.query.id}`, query });
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

        <PreparedQueryForm
            @created="handleCreated"
            @failed="handleFailed"
        />

        <template v-if="error">
            <APIClientErrorBox :error="error" />
        </template>
    </div>
</template>
