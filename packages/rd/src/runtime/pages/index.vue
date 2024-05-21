<script lang="ts">
import { PageMetaKey, useToast } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/RSearchForm.vue';
import type { QueryCriteria } from '../domains';
import PreparedQueryForm from '../components/core/RPreparedQueryForm.vue';

export default defineNuxtComponent({
    components: {
        PreparedQueryForm,
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
        });

        const toast = useToast();

        const handleFailed = (e: ClientError) => {
            toast.show({
                body: e.message,
                variant: 'warning',
            });
        };

        const handleSubmitted = async (data : {
            criteria: QueryCriteria,
            queryId: string,
            preparedQueryId?: string
        }) => {
            let query : Record<string, any> | undefined;
            if (data.preparedQueryId) {
                query = {
                    preparedQueryId: data.preparedQueryId,
                };
            }

            await navigateTo({ path: `/rd/query/${data.queryId}`, query });
        };

        return {
            handleFailed,
            handleSubmitted,
        };
    },
});
</script>

<template>
    <div class="">
        <h1 class="title no-border mb-3">
            <i class="fa fa-search" /> Suche
        </h1>

        <PreparedQueryForm
            @submitted="handleSubmitted"
            @failed="handleFailed"
        />
    </div>
</template>
