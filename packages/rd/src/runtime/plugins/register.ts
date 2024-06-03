/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PageMetaKey } from '@dnpm-dip/core';
import type { ModuleMeta } from '@dnpm-dip/core';
import type { HookResult } from '@nuxt/schema';
import { defineNuxtPlugin } from '#imports';
import { PermissionName } from '../domains';

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
                name: 'RD',
                baseURL: '/rd/',
                requireLoggedIn: true,
                navigationItems: [
                    {
                        id: 'rd-search',
                        name: 'Suche',
                        icon: 'fa fa-search',
                        url: '',
                        [PageMetaKey.REQUIRED_PERMISSIONS]: [
                            PermissionName.QUERY_SUBMIT,
                        ],
                    },
                ],
                navigationTopId: 'rd',
            },
        );
    },
});
