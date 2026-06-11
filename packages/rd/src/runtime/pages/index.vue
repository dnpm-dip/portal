<script lang="ts">
import { DPreparedQueryContainer, PageMetaKey, useToast } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/RSearchForm.vue';
import { PermissionName, type QuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        DPreparedQueryContainer,
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.QUERY_SUBMIT,
            ],
        });

        const toast = useToast();

        const handleFailed = (e: ClientError) => {
            toast.showError(e);
        };

        const handleSubmitted = async (data: QuerySession) => {
            await navigateTo({ path: `/rd/query/${data.id}` });
        };

        return {
            handleFailed,
            handleSubmitted,
        };
    },
});
</script>

<template>
    <div>
        <header class="mb-4 flex items-center gap-4">
            <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl
                       bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary shadow-md"
            >
                <VCIcon name="fa6-solid:magnifying-glass" />
            </span>
            <div class="min-w-0">
                <h1 class="mb-0 text-2xl font-bold tracking-tight">
                    Suche
                </h1>
                <p class="mb-0 text-sm text-fg-muted">
                    Seltene Erkrankungen
                </p>
            </div>
        </header>

        <DPreparedQueryContainer
            use-case="rd"
            @submitted="handleSubmitted"
            @failed="handleFailed"
        >
            <template #default="props">
                <SearchForm
                    :criteria="props.criteria"
                    @save="props.setCriteria"
                    @failed="props.failed"
                    @created="props.queryCreated"
                    @updated="props.queryUpdated"
                />
            </template>
        </DPreparedQueryContainer>
    </div>
</template>
