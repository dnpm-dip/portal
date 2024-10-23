/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PermissionName as AuthupPermissionName } from '@authup/core-kit';
import { type ModuleMeta, PageMetaKey } from '@dnpm-dip/core';
import type { HookResult } from '@nuxt/schema';
import { defineNuxtPlugin } from '#imports';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'register': (element: ModuleMeta) => HookResult
    }
}

export default defineNuxtPlugin({
    dependsOn: ['dnpm:register'],
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
                        meta: {
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [],
                        },
                    },
                    {
                        name: 'Identitätsanbieter',
                        type: 'link',
                        url: 'identity-providers',
                        icon: 'fa-solid fa-atom',
                        meta: {
                            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                                AuthupPermissionName.IDENTITY_PROVIDER_CREATE,
                                AuthupPermissionName.IDENTITY_PROVIDER_UPDATE,
                                AuthupPermissionName.IDENTITY_PROVIDER_DELETE,
                                AuthupPermissionName.IDENTITY_PROVIDER_READ,
                            ],
                        },
                    },
                    {
                        name: 'Benutzer',
                        type: 'link',
                        url: 'users',
                        icon: 'fas fa-user',
                        meta: {
                            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                                AuthupPermissionName.USER_CREATE,
                                AuthupPermissionName.USER_UPDATE,
                                AuthupPermissionName.USER_DELETE,
                                AuthupPermissionName.USER_READ,
                            ],
                        },
                    },
                    {
                        name: 'Rollen',
                        type: 'link',
                        url: 'roles',
                        icon: 'fa-solid fa-theater-masks',
                        meta: {
                            [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                                AuthupPermissionName.ROLE_CREATE,
                                AuthupPermissionName.ROLE_UPDATE,
                                AuthupPermissionName.ROLE_DELETE,
                                AuthupPermissionName.ROLE_READ,
                                AuthupPermissionName.ROLE_PERMISSION_CREATE,
                                AuthupPermissionName.ROLE_PERMISSION_DELETE,
                                AuthupPermissionName.ROLE_PERMISSION_READ,
                            ],
                        },
                    },
                ],
            },
        );
    },
});
