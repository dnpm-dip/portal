<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    PageMetaKey, 
    PageNavigationTopID, 
    useToast,
} from '@dnpm-dip/core';
import { VCNavItems } from '@vuecs/navigation';
import type { User } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { definePageMeta } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: { VCNavItems },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.USER_UPDATE,
                PermissionName.USER_CREATE,
                PermissionName.USER_DELETE,
                PermissionName.USER_READ,
            ],
        });

        const toast = useToast();

        const items = [
            {
                name: 'Übersicht',
                url: '/admin/users',
                icon: 'fa6-solid:bars',
            },
            {
                name: 'Hinzufügen',
                url: '/admin/users/add',
                icon: 'fa6-solid:plus',
            },
        ];

        const handleDeleted = (e: User) => {
            if (toast) {
                toast.show({ variant: 'success', body: `The user ${e.name} was successfully deleted.` });
            }
        };

        const handleFailed = (e: Error) => {
            if (toast) {
                toast.show({ variant: 'warning', body: e.message });
            }
        };

        return {
            items,
            handleFailed,
            handleDeleted,
        };
    },
});
</script>
<template>
    <div>
        <h1 class="title no-border mb-3">
            <VCIcon
                name="fa6-solid:user"
                class="me-1"
            /> Benutzer
            <span class="sub-title ms-1">
                Verwaltung
            </span>
        </h1>
        <div class="content-wrapper">
            <div class="content-sidebar flex-col">
                <VCNavItems
                    :data="items"
                    variant="pills"
                    orientation="vertical"
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
