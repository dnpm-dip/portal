<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">

import type { IdentityProvider } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import {
    DNav, PageMetaKey, PageNavigationTopID, useToast,
} from '@dnpm-dip/core';
import { definePageMeta } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        DNav,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.IDENTITY_PROVIDER_UPDATE,
                PermissionName.IDENTITY_PROVIDER_DELETE,
                PermissionName.IDENTITY_PROVIDER_CREATE,
            ],
        });

        const toast = useToast();

        const items = [
            {
                name: 'Übersicht',
                urlSuffix: '',
                icon: 'fa fa-bars',
            },
            {
                name: 'Hinzufügen',
                urlSuffix: 'add',
                icon: 'fa fa-plus',
            },
        ];

        const handleDeleted = (e: IdentityProvider) => {
            if (toast) {
                toast.show({ variant: 'success', body: `The identity-provider ${e.name} was successfully deleted.` });
            }
        };

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.show({ variant: 'warning', body: e.message });
            }
        };

        return {
            handleDeleted,
            handleFailed,
            items,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <i class="fa-solid fa-atom me-1" /> Identitätsanbieter
            <span class="sub-title ms-1">Verwaltung</span>
        </h1>
        <div class="content-wrapper">
            <div class="content-sidebar flex-column">
                <DNav
                    :items="items"
                    path="/admin/identity-providers"
                    direction="vertical"
                />
            </div>
            <div class="content-main">
                <NuxtPage
                    @deleted="handleDeleted"
                    @failed="handleFailed"
                />
            </div>
        </div>
    </div>
</template>
