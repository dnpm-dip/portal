<script lang="ts">
import { AUserForm, storeToRefs, useStore } from '@authup/client-web-kit';
import type { User } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: {
        AUserForm,
    },
    emits: ['failed', 'created'],
    setup(props, { emit }) {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.USER_ADD,
            ],
        });

        const store = useStore();

        const handleCreated = (e: User) => {
            navigateTo({ path: `/admin/users/${e.id}` });
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const { realmManagementId } = storeToRefs(store);

        return {
            realmManagementId,
            handleCreated,
            handleFailed,
        };
    },
});
</script>
<template>
    <AUserForm
        :realm-id="realmManagementId"
        @created="handleCreated"
        @failed="handleFailed"
    />
</template>
