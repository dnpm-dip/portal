<script lang="ts">
import { PageMetaKey } from '@dnpm-dip/core';
import { ref } from 'vue';
import {
    createError, defineNuxtComponent, navigateTo, useRoute,
} from '#app';
import { definePageMeta, useRDAPIClient } from '#imports';
import type { QuerySession } from '../../domains/query';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
        });

        const api = useRDAPIClient();
        const route = useRoute();

        const entity = ref<QuerySession>(null) as any;

        try {
            entity.value = await api.query.getOne(route.params.id);
        } catch (e) {
            await navigateTo({ path: '/rd/search' });
            throw createError({});
        }

        return {
            entity,
        };
    },
});
</script>
<template>
    <NuxtPage :entity="entity" />
</template>
