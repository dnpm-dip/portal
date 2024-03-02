<script lang="ts">
import { ARoleForm } from '@authup/client-vue';
import type { Role } from '@authup/core';
import { PermissionName } from '@authup/core';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { storeToRefs } from 'pinia';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';
import { useAuthStore } from '../../../../stores/auth';

export default defineNuxtComponent({
    components: {
        ARoleForm,
    },
    emits: ['failed', 'created'],
    setup(props, { emit }) {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.ROLE_ADD,
            ],
        });

        const handleCreated = (e: Role) => {
            navigateTo({ path: `/admin/roles/${e.id}` });
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

        const store = useAuthStore();
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
    <ARoleForm
        :realm-id="realmManagementId"
        @created="handleCreated"
        @failed="handleFailed"
    />
</template>
