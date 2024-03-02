<script lang="ts">

import type { Role } from '@authup/core';
import { PermissionName, isRealmResourceWritable } from '@authup/core';
import {
    DNav, PageMetaKey, PageNavigationTopID, extendRefRecord, useToast,
} from '@dnpm-dip/core';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import {
    definePageMeta,
} from '#imports';
import {
    createError, defineNuxtComponent, navigateTo, useRoute,
} from '#app';
import { useAuthupAPIClient } from '../../../composables';
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
                PermissionName.ROLE_EDIT,
                PermissionName.USER_ROLE_ADD,
                PermissionName.USER_ROLE_EDIT,
                PermissionName.USER_ROLE_DROP,
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

        const route = useRoute();

        const entity : Ref<Role> = ref(null) as any;

        try {
            entity.value = await useAuthupAPIClient()
                .role
                .getOne(route.params.id as string);
        } catch (e) {
            await navigateTo({ path: '/admin/roles' });
            throw createError({});
        }

        const store = useAuthStore();
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
