/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PolicyIdentity } from '@authup/kit';
import { PageMetaKey, hasOwnProperty } from '@dnpm-dip/core';
import { storeToRefs } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { useStore } from '@authup/client-web-kit';
import {
    navigateTo,
} from '#app';

async function checkPermissions(route: RouteLocationNormalized, has: (name: string) => Promise<boolean>) {
    let isAllowed : undefined | boolean;

    for (let j = 0; j < route.matched.length; j++) {
        const matchedRecord = route.matched[j];

        if (!hasOwnProperty(matchedRecord.meta, PageMetaKey.REQUIRED_PERMISSIONS)) {
            continue;
        }

        const value = matchedRecord.meta[PageMetaKey.REQUIRED_PERMISSIONS];
        if (Array.isArray(value)) {
            let passed = false;
            for (let k = 0; k < value.length; k++) {
                const outcome = await has(value[k]);
                if (outcome) {
                    passed = true;
                    break;
                }
            }
            isAllowed = passed;
        }

        if (isAllowed) {
            return true;
        }
    }

    if (typeof isAllowed === 'undefined') {
        return true;
    }

    if (!isAllowed) {
        const parts = route.path.split('/');
        parts.pop();
        throw new Error(parts.join('/'));
    }

    return true;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    const store = useStore();

    let previousPath = '/login';

    if (
        typeof from !== 'undefined' &&
        from.fullPath !== to.fullPath
    ) {
        previousPath = from.fullPath;
    }

    try {
        await store.resolve();
    } catch (e) {
        store.logout();

        if (
            !to.fullPath.startsWith('/logout') &&
            !to.fullPath.startsWith('/login')
        ) {
            return navigateTo({
                path: '/logout',
                query: {
                    redirect: previousPath,
                },
            });
        }

        return undefined;
    }

    const { loggedIn, userId } = storeToRefs(store);

    if (to.matched.some((matched) => !!matched.meta[PageMetaKey.REQUIRED_LOGGED_IN])) {
        if (!loggedIn.value) {
            const query : Record<string, any> = {};

            if (
                !to.fullPath.startsWith('/logout') &&
                !to.fullPath.startsWith('/login')
            ) {
                query.redirect = to.fullPath;
            }

            return navigateTo({
                path: '/login',
                query,
            });
        }
    }

    let identity : PolicyIdentity | undefined;
    if (userId.value) {
        identity = {
            type: 'user',
            id: userId.value,
        };
    }

    try {
        await checkPermissions(
            to,
            (name) => store.permissionChecker
                .preCheck({
                    name,
                    data: {
                        identity,
                    },
                }).then(() => true)
                .catch(() => false),
        );
    } catch (e) {
        return navigateTo({
            path: previousPath,
        });
    }

    if (
        !to.fullPath.startsWith('/logout') &&
        to.matched.some((matched) => matched.meta[PageMetaKey.REQUIRED_LOGGED_OUT])
    ) {
        const query : Record<string, any> = {};
        if (!previousPath.includes('logout')) {
            query.redirect = previousPath;
        }

        if (loggedIn.value) {
            return navigateTo({
                path: '/logout',
                query,
            });
        }
    }

    return undefined;
});
