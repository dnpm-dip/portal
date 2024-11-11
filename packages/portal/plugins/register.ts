/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ModuleMeta, NavigationItemMeta } from '@dnpm-dip/core';
import { PageMetaKey } from '@dnpm-dip/core';
import type { HookResult } from '@nuxt/schema';
import type { NavigationItem } from '@vuecs/navigation';
import { install as installNavigation } from '@vuecs/navigation';
import type { Pinia } from 'pinia';
import { injectStore } from '@authup/client-web-kit';
import { defineNuxtPlugin } from '#app';
import { Navigation } from '../core';
import { useModuleStore } from '../stores/modules';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'register': (element: ModuleMeta) => HookResult
    }
}

function extendNavigationItemsURL(items: NavigationItem[], baseURL: string) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (typeof item.url === 'undefined') {
            continue;
        }

        if (!item.url.startsWith(baseURL)) {
            item.url = baseURL + item.url;
        }

        if (item.children) {
            extendNavigationItemsURL(item.children, baseURL);
        }
    }

    return items;
}

function extractNavigationItemsPermissions(items: NavigationItem<NavigationItemMeta>[]) : string[] {
    const permissions : string[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item.meta) {
            continue;
        }

        if (Array.isArray(item.meta[PageMetaKey.REQUIRED_PERMISSIONS])) {
            permissions.push(...item.meta[PageMetaKey.REQUIRED_PERMISSIONS]);
        }

        if (typeof item.meta[PageMetaKey.REQUIRED_PERMISSIONS] === 'string') {
            permissions.push(item.meta[PageMetaKey.REQUIRED_PERMISSIONS]);
        }

        if (item.children) {
            permissions.push(...extractNavigationItemsPermissions(item.children));
        }
    }

    return permissions;
}

export default defineNuxtPlugin<Record<string, any>>({
    name: 'dnpm:register',
    dependsOn: ['dnpm:kit'],
    async setup(nuxt) {
        const authStore = injectStore(nuxt.$pinia as Pinia);
        const moduleStore = useModuleStore(nuxt.$pinia as Pinia);

        const navigation = new Navigation(authStore);

        nuxt.hook('register', (context: ModuleMeta) => {
            if (context.navigationItems) {
                context.requirePermissions = extractNavigationItemsPermissions(context.navigationItems);

                const topNavigationItem: NavigationItem<NavigationItemMeta> = {
                    name: context.name,
                    url: context.baseURL,
                    activeMatch: context.baseURL,
                    meta: {
                        requireLoggedIn: context.requireLoggedIn,
                        requirePermissions: context.requirePermissions,
                    },
                };

                if (context.baseURL) {
                    extendNavigationItemsURL(context.navigationItems, context.baseURL);
                }

                navigation.addTopElement(topNavigationItem);
                navigation.addSideElements(context.name, context.navigationItems);
            }

            moduleStore.register(context);
        });

        installNavigation(nuxt.vueApp, {
            items: ({
                level,
                parent,
            }) => navigation.getItems(level, parent),
        });
    },
});
