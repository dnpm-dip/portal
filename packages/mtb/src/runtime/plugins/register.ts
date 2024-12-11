/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ModuleType, PageMetaKey } from '@dnpm-dip/core';
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
    dependsOn: ['dnpm:register'],
    async setup(nuxt) {
        await nuxt.callHook(
            'register',
            {
                type: ModuleType.USE_CASE,
                name: 'MTB',
                baseURL: '/mtb/',
                requireLoggedIn: true,
                navigationItems: [
                    {
                        name: 'Suche',
                        icon: 'fa fa-search',
                        url: '',
                        meta: {
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                                PermissionName.QUERY_SUBMIT,
                            ],
                        },
                    },
                    {
                        name: 'Validierung',
                        icon: 'fas fa-shield',
                        url: 'validation',
                        meta: {
                            [PageMetaKey.REQUIRED_PERMISSIONS]: [
                                PermissionName.VALIDATION_INFO_READ,
                                PermissionName.VALIDATION_REPORT_READ,
                                PermissionName.VALIDATION_PATIENT_RECORD_READ,
                            ],
                        },
                    },
                ],
            },
        );
    },
});
