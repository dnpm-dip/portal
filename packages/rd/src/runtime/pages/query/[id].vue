<script lang="ts">
import {
    PageMetaKey, QueryEventBusEventName, injectQueryEventBus, useQuerySessionStore, useToast,
} from '@dnpm-dip/core';
import {
    defineComponent, onMounted, onUnmounted, ref,
} from 'vue';
import {
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
        const store = useQuerySessionStore();
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

            store.setUseCase('rd');
            store.track(entity.value);
        });

        onUnmounted(() => {
            store.setUseCase(null);
            store.unTrack();

            filtersCommitedUnsubscribeFn();
        });

        if (typeof route.params.id !== 'string') {
            await navigateTo({ path: '/rd/' });
        } else {
            try {
                entity.value = await api.query.getOne(route.params.id);
            } catch (e) {
                await navigateTo({ path: '/rd/' });
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
    <template v-if="entity">
        <NuxtPage
            :entity="entity"
            @updated="handleUpdated"
            @failed="handleFailed"
        />
    </template>
</template>
