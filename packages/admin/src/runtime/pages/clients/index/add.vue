<script lang="ts">
import { AClientForm, injectStore, storeToRefs } from '@authup/client-web-kit';
import type { Client } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import { defineNuxtComponent, navigateTo } from '#app';
import { definePageMeta } from '#imports';

export default defineNuxtComponent({
    components: { AClientForm },
    emits: ['failed', 'created'],
    setup(props, { emit }) {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.CLIENT_CREATE,
            ],
        });

        const store = injectStore();

        const handleCreated = (e: Client) => {
            navigateTo({ path: `/admin/clients/${e.id}` });
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
    <AClientForm
        :realm-id="realmManagementId"
        @created="handleCreated"
        @failed="handleFailed"
    />
</template>
