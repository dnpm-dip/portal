<script lang="ts">
import { DPreparedQueryContainer, PageMetaKey, useToast } from '@dnpm-dip/core';
import type { ClientError } from 'hapic';
import { defineNuxtComponent, definePageMeta, navigateTo } from '#imports';
import SearchForm from '../components/core/search/MSearchForm.vue';
import { PermissionName, type QuerySession } from '../domains';

export default defineNuxtComponent({
    components: {
        DPreparedQueryContainer,
        SearchForm,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.QUERY_SUBMIT,
            ],
        });

        const { showError } = useToast();

        const handleFailed = (e: ClientError) => {
            showError(e);
        };

        const handleSubmitted = async (data : QuerySession) => {
            await navigateTo({ path: `/mtb/query/${data.id}/summary` });
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
                    Molekulares Tumorboard
                </p>
            </div>
        </header>

        <VCAlert
            color="info"
            variant="soft"
            size="sm"
        >
            Die Datenabfrage ist auch ohne Auswahl von Suchparametern möglich.
            In diesem Fall werden alle auf DNPM:DIP verfügbaren Daten angezeigt.
            Die Abfrage kann nachfolgend angepasst werden.
        </VCAlert>

        <DPreparedQueryContainer
            use-case="mtb"
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
