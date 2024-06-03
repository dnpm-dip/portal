<!--
  - Copyright (c) 2024.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    DNav, PageMetaKey, PageNavigationTopID, useToast,
} from '@dnpm-dip/core';
import type { User } from '@authup/core-kit';
import { PermissionName } from '@authup/core-kit';
import { definePageMeta } from '#imports';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        DNav,
    },
    setup() {
        definePageMeta({
            [PageMetaKey.NAVIGATION_TOP_ID]: PageNavigationTopID.ADMIN,
            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                PermissionName.USER_EDIT,
                PermissionName.USER_ADD,
                PermissionName.USER_DROP,
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
                urlSuffix: '/add',
                icon: 'fa fa-plus',
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
            <i class="fa fa-user me-1" /> Benutzer
            <span class="sub-title ms-1">
                Verwaltung
            </span>
        </h1>
        <div class="content-wrapper">
            <div class="content-sidebar flex-column">
                <DNav
                    :items="items"
                    path="/admin/users"
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
