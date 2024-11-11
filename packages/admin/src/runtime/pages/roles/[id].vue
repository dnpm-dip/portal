<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">

import { injectHTTPClient, injectStore, storeToRefs } from '@authup/client-web-kit';
import type { Role } from '@authup/core-kit';
import { PermissionName, isRealmResourceWritable } from '@authup/core-kit';
import {
    DNav, PageMetaKey, PageNavigationTopID, extendRefRecord, useToast,
} from '@dnpm-dip/core';
import { defineComponent, ref } from 'vue';
import type { Ref } from 'vue';
import {
    definePageMeta,
} from '#imports';
import {
    createError, navigateTo, useRoute,
} from '#app';

export default defineComponent({
    components: {
        DNav,
    },
    async setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.ROLE_UPDATE,
                PermissionName.USER_ROLE_CREATE,
                PermissionName.USER_ROLE_UPDATE,
                PermissionName.USER_ROLE_DELETE,
            ],
        });

        const items = [
            {
                name: 'Allgemein', icon: 'fas fa-bars', urlSuffix: '',
            },
            {
                name: 'Berechtigungen', icon: 'fas fa-user-secret', urlSuffix: 'permissions',
            },
            {
                name: 'Benutzer', icon: 'fas fa-users', urlSuffix: 'users',
            },
        ];

        const toast = useToast();
        const store = injectStore();
        const route = useRoute();
        const authup = injectHTTPClient();

        const entity : Ref<Role> = ref(null) as any;

        try {
            entity.value = await authup
                .role
                .getOne(route.params.id as string);
        } catch (e) {
            await navigateTo({ path: '/admin/roles' });
            throw createError({});
        }

        const { realmManagement } = storeToRefs(store);

        if (!isRealmResourceWritable(realmManagement.value, entity.value.realm_id)) {
            await navigateTo({ path: '/admin/roles' });
            throw createError({});
        }

        const handleUpdated = (e: Role) => {
            if (toast) {
                toast.show({ variant: 'success', body: 'The role was successfully updated.' });
            }

            extendRefRecord(entity, e);
        };

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.show({ variant: 'warning', body: e.message });
            }
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
            <i class="fa-solid fa-theater-masks me-1" /> {{ entity.name }}
            <span class="sub-title ms-1">Details</span>
        </h1>
        <div class="mb-2">
            <DNav
                :path="'/admin/roles/'+entity.id"
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
