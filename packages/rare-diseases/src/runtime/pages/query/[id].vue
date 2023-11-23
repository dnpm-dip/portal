<script lang="ts">
import { PageMetaKey } from '@dnpm-dip/core';
import type { Ref } from 'vue';
import { ref } from 'vue';
import {
    createError, defineNuxtComponent, definePageMeta, navigateTo,
    useRDAPIClient, useRoute,
} from '#imports';
import type { RDQuerySession } from '../../domains';

export default defineNuxtComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
        });

        const api = useRDAPIClient();
        const route = useRoute();

        const entity = ref(null) as unknown as Ref<RDQuerySession>;

        if (typeof route.params.id !== 'string') {
            await navigateTo({ path: '/rd/search' });
            throw createError({});
        }

        try {
            entity.value = await api.query.getOne(route.params.id);
        } catch (e) {
            await navigateTo({ path: '/rd/search' });
            throw createError({});
        }

        const handleUpdated = (data: RDQuerySession) => {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i] as keyof RDQuerySession;
                (entity.value as RDQuerySession)[key] = data[key];
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
