<script lang="ts">
import { PageMetaKey, useQuerySessionStore, useToast } from '@dnpm-dip/core';
import {
    defineComponent, onMounted, onUnmounted, ref,
} from 'vue';
import {
    createError,
    definePageMeta,
    useRoute,
    useRouter,
} from '#imports';
import { injectHTTPClient } from '../../core/http-client';
import type { QuerySession } from '../../domains';

export default defineComponent({
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: 'mtb',
            [PageMetaKey.NAVIGATION_SIDE_ID]: 'mtb-search',
        });

        const api = injectHTTPClient();
        const router = useRouter();
        const route = useRoute();
        const toast = useToast();
        const store = useQuerySessionStore();

        const entity = ref<null | QuerySession>(null);

        onMounted(() => {
            if (!entity.value) {
                return;
            }

            store.setUseCase('mtb');
            store.track(entity.value);
        });

        onUnmounted(() => {
            store.setUseCase(null);
            store.unTrack();
        });

        if (typeof route.params.id !== 'string') {
            await router.push({ path: '/mtb/' });
            throw createError({});
        }

        try {
            entity.value = await api.query.getOne(route.params.id);
        } catch (e) {
            await router.push({ path: '/mtb/' });
            throw createError({});
        }

        const handleUpdated = (data: QuerySession) => {
            if (!entity.value) {
                return;
            }

            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                entity.value[keys[i]] = data[keys[i]];
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
    <div>
        <template v-if="entity">
            <NuxtPage
                :entity="entity"
                @updated="handleUpdated"
                @failed="handleFailed"
            />
        </template>
    </div>
</template>
