<script lang="ts">
import { PageMetaKey } from '@dnpm-dip/core';
import type { Ref } from 'vue';
import { ref } from 'vue';
import {
    createError,
    defineNuxtComponent,
    definePageMeta,
    navigateTo,
    useMTBAPIClient,
    useRoute,
} from '#imports';
import type { QuerySession } from '../../domains';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
        });

        const api = useMTBAPIClient();
        const route = useRoute();

        const entity = ref(null) as unknown as Ref<QuerySession>;

        if (typeof route.params.id !== 'string') {
            await navigateTo({ path: '/mtb/search' });
            throw createError({});
        }

        try {
            entity.value = await api.query.getOne(route.params.id);
        } catch (e) {
            await navigateTo({ path: '/mtb/search' });
            throw createError({});
        }

        const handleUpdated = (data: QuerySession) => {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i] as keyof QuerySession;
                (entity.value as QuerySession)[key] = data[key];
            }
        };

        return {
            entity,
            handleUpdated,
        };
    },
});
</script>
<template>
    <div class="container">
        <template v-if="entity">
            <NuxtPage
                :entity="entity"
                @updated="handleUpdated"
            />
        </template>
    </div>
</template>
