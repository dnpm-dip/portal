<script lang="ts">
import {
    PageMetaKey,
    QueryEventBusEventName,
    injectQueryEventBus,
    useQuerySessionStore,
    useToast,
} from '@dnpm-dip/core';
import {
    defineComponent, onMounted, onUnmounted, ref,
} from 'vue';
import {
    definePageMeta,
    navigateTo,
    useRoute,
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
        const route = useRoute();
        const toast = useToast();
        const sessionStore = useQuerySessionStore();
        const evenBus = injectQueryEventBus();

        const entity = ref<null | QuerySession>(null);

        const filtersCommitedUnsubscribeFn = evenBus.on(
            QueryEventBusEventName.FILTERS_COMMITED,
            () => {
                toast.show('Die Filterkriterien wurden aktualisiert.', {
                    variant: 'dark',
                });
            },
        );

        onMounted(() => {
            if (!entity.value) {
                return;
            }

            sessionStore.setUseCase('mtb');
            sessionStore.track(entity.value);
        });

        onUnmounted(() => {
            sessionStore.setUseCase(null);
            sessionStore.unTrack();

            filtersCommitedUnsubscribeFn();
        });

        if (typeof route.params.id !== 'string') {
            await navigateTo({ path: '/mtb/' });
        } else {
            try {
                entity.value = await api.query.getOne(route.params.id);
            } catch (e) {
                await navigateTo({ path: '/mtb/' });
            }
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
