/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PermissionName } from '@authup/core-kit';
import { type ModuleMeta, PageMetaKey } from '@dnpm-dip/core';
import type { HookResult } from '@nuxt/schema';
import { defineNuxtPlugin } from '#imports';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'register': (element: ModuleMeta) => HookResult
    }
}

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        await nuxt.callHook(
            'register',
            {
                name: 'Admin',
                baseURL: '/admin/',
                requireLoggedIn: true,
                navigationItems: [
                    {
                        name: 'Overview',
                        type: 'link',
                        url: '',
                        icon: 'fa fa-home',
                        [PageMetaKey.REQUIRED_PERMISSIONS]: [

                        ],
                    },
                    {
                        name: 'Identitätsanbieter',
                        type: 'link',
                        url: 'identity-providers',
                        icon: 'fa-solid fa-atom',
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                        [PageMetaKey.REQUIRED_PERMISSIONS]: [
                            PermissionName.PROVIDER_ADD,
                            PermissionName.PROVIDER_EDIT,
                            PermissionName.PROVIDER_DROP,
                        ],
                    },
                    {
                        name: 'Benutzer',
                        type: 'link',
                        url: 'users',
                        icon: 'fas fa-user',
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                        [PageMetaKey.REQUIRED_PERMISSIONS]: [
                            PermissionName.USER_ADD,
                            PermissionName.USER_EDIT,
                            PermissionName.USER_DROP,
                        ],
                    },
                    {
                        name: 'Rollen',
                        type: 'link',
                        url: 'roles',
                        icon: 'fa-solid fa-theater-masks',
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                        [PageMetaKey.REQUIRED_PERMISSIONS]: [
                            PermissionName.ROLE_ADD,
                            PermissionName.ROLE_EDIT,
                            PermissionName.ROLE_DROP,
                            PermissionName.ROLE_PERMISSION_ADD,
                            PermissionName.ROLE_PERMISSION_DROP,
                        ],
                    },
                ],
                navigationTopId: 'admin',
            },
        );
    },
});
