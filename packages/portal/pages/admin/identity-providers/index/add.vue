<script lang="ts">
import { AIdentityProviderForm } from '@authup/client-web-kit';
import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { storeToRefs } from 'pinia';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';
import { useAuthStore } from '../../../../stores/auth';

export default defineNuxtComponent({
    components: {
        AIdentityProviderForm,
    },
    emits: ['failed', 'created'],
    setup(props, { emit }) {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.PROVIDER_ADD,
            ],
        });

        const handleCreated = (e: IdentityProvider) => {
            navigateTo({ path: `/admin/identity-providers/${e.id}` });
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
    <div>
        <AIdentityProviderForm
            @created="handleCreated"
            @failed="handleFailed"
        />
    </div>
</template>
