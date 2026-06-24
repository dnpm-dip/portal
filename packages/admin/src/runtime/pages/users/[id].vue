<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { injectHTTPClient } from '@authup/client-web-kit';
import {
    PageMetaKey, 
    PageNavigationTopID, 
    extendRefRecord, 
    useToast,
} from '@dnpm-dip/core';
import type { User } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { computed, defineComponent, ref } from 'vue';
import type { Ref } from 'vue';
import { VCNavItems } from '@vuecs/navigation';
import type { NavigationItem } from '@vuecs/navigation';
import {
    createError,
    definePageMeta,
    navigateTo,
    useRoute,
} from '#imports';

export default defineComponent({
    components: { VCNavItems },
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.USER_UPDATE,
                PermissionName.USER_DELETE,
                PermissionName.USER_READ,
                PermissionName.USER_ROLE_CREATE,
                PermissionName.USER_ROLE_UPDATE,
                PermissionName.USER_ROLE_DELETE,
            ],
        });

        const toast = useToast();
        const route = useRoute();
        const authup = injectHTTPClient();

        const entity = ref(null) as unknown as Ref<User>;

        try {
            entity.value = await authup
                .user
                .getOne(route.params.id as string, { fields: ['+email'] });
        } catch {
            await navigateTo({ path: '/admin/users' });
            throw createError({});
        }

        const items = computed<NavigationItem[]>(() => {
            const base = `/admin/users/${entity.value.id}`;
            return [
                {
                    name: '', 
                    icon: 'fa6-solid:arrow-left', 
                    url: '/admin/users', 
                },
                {
                    name: 'Allgemein', 
                    icon: 'fa6-solid:bars', 
                    url: base, 
                },
                {
                    name: 'Berechtigungen', 
                    icon: 'fa6-solid:user-secret', 
                    url: `${base}/permissions`, 
                },
                {
                    name: 'Rollen', 
                    icon: 'fa6-solid:user-group', 
                    url: `${base}/roles`, 
                },
            ];
        });

        const handleUpdated = (e: User) => {
            if (toast) {
                toast.show({ variant: 'success', body: 'The user was successfully updated.' });
            }

            extendRefRecord(entity, e);
        };

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.show({ variant: 'warning', body: e.message });
            }
        };

        return {
            items,
            entity,
            handleUpdated,
            handleFailed,
        };
    },
});
</script>
<template>
    <div v-if="entity">
        <h1 class="title no-border mb-3">
            <VCIcon
                name="fa6-solid:user"
                class="me-1"
            />
            {{ entity.name }}
            <span class="sub-title ms-1">
                Details
            </span>
        </h1>
        <div class="mb-2">
            <VCNavItems
                :data="items"
                variant="pills"
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
