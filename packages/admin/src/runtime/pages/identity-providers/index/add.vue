<script lang="ts">
import { AIdentityProviderForm, storeToRefs, useStore } from '@authup/client-web-kit';
import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';

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

        const store = useStore();
        const { realmManagementId } = storeToRefs(store);

        const handleCreated = (e: IdentityProvider) => {
            navigateTo({ path: `/admin/identity-providers/${e.id}` });
        };

        const handleFailed = (e: Error) => {
            emit('failed', e);
        };

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
