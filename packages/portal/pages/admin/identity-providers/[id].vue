<script lang="ts">

import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName, isRealmResourceWritable } from '@authup/core-kit';
import {
    DNav, PageMetaKey, PageNavigationTopID, extendRefRecord, useToast,
} from '@dnpm-dip/core';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import {
    createError,
    defineNuxtComponent,
    definePageMeta,
    navigateTo,
    useAuthupAPIClient,
    useRoute,
} from '#imports';
import { useAuthStore } from '../../../stores/auth';

export default defineNuxtComponent({
    components: {
        DNav,
    },
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.PROVIDER_EDIT,
            ],
        });

        const items = [
            {
                name: 'General', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Roles', icon: 'fa-solid fa-theater-masks', urlSuffix: 'roles',
            },
        ];

        const toast = useToast();

        const route = useRoute();

        const entity: Ref<IdentityProvider> = ref(null) as any;

        try {
            entity.value = await useAuthupAPIClient()
                .identityProvider
                .getOne(route.params.id as string);
        } catch (e) {
            await navigateTo({ path: '/admin/identity-providers' });
            throw createError({});
        }

        const store = useAuthStore();
        const { realmManagement } = storeToRefs(store);

        if (!isRealmResourceWritable(realmManagement.value, entity.value.realm_id)) {
            await navigateTo({ path: '/admin/identity-providers' });
            throw createError({});
        }

        const handleUpdated = (e: IdentityProvider) => {
            toast.show({ variant: 'success', body: 'The identity-provider was successfully updated.' });

            extendRefRecord(entity, e);
        };

        const handleFailed = (e: Error) => {
            toast.show({ variant: 'warning', body: e.message });
        };

        return {
            entity,
            items,
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa-solid fa-atom me-1" /> {{ entity.name }}
            <span class="sub-title ms-1">Details</span>
        </h1>
        <div class="mb-2">
            <DNav
                :path="'/admin/identity-providers/'+entity.id"
                :items="items"
                :prev-link="true"
            />
        </div>
        <div>
            <NuxtPage
                :entity="entity"
                @updated="handleUpdated"
                @failed="handleFailed"
            />
        </div>
    </div>
</template>
