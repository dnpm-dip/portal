<script lang="ts">
import { PageMetaKey, useToast } from '@dnpm-dip/core';
import { type Ref, defineComponent } from 'vue';
import { ref } from 'vue';
import {
    createError,
    definePageMeta,
    navigateTo,
    useRoute,
} from '#imports';
import { injectHTTPClient } from '../../core';
import type { QuerySession } from '../../domains';

export default defineComponent({
    async setup(_, { emit }) {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'rd',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'rd-search',
        });

        const api = injectHTTPClient();
        const route = useRoute();
        const toast = useToast();

        const entity = ref(null) as unknown as Ref<QuerySession>;

        if (typeof route.params.id !== 'string') {
            await navigateTo({ path: '/rd/' });
            throw createError({});
        }

        try {
            entity.value = await api.query.getOne(route.params.id);
        } catch (e) {
            await navigateTo({ path: '/rd/' });
            throw createError({});
        }

        const handleUpdated = (data: QuerySession) => {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i] as keyof QuerySession;
                (entity.value as QuerySession)[key] = data[key];
            }
        };

        const handleFailed = (e: Error) => {
            toast.showError(e);
        };

        return {
            entity,
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <template v-if="entity">
        <NuxtPage
            :entity="entity"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </template>
</template>
