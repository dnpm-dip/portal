import type { PolicyIdentity } from '@authup/kit';
import { type ModuleMeta, PageMetaKey } from '@dnpm-dip/core';
import type { HookResult } from '@nuxt/schema';
import type { NavigationItem } from '@vuecs/navigation';
import installNavigation from '@vuecs/navigation';
import type { Pinia } from 'pinia';
import { storeToRefs, useStore } from '@authup/client-web-kit';
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

function extractNavigationItemsPermissions(items: NavigationItem[]) : string[] {
    const permissions : string[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (Array.isArray(item[PageMetaKey.REQUIRED_PERMISSIONS])) {
            permissions.push(...item[PageMetaKey.REQUIRED_PERMISSIONS]);
        }

        if (item.children) {
            permissions.push(...extractNavigationItemsPermissions(item.children));
        }
    }

    return permissions;
}

export default defineNuxtPlugin<Record<string, any>>({
    enforce: 'pre',
    async setup(nuxt) {
        const authStore = useStore(nuxt.$pinia as Pinia);
        const moduleStore = useModuleStore(nuxt.$pinia as Pinia);

        const {
            loggedIn,
            userId,
        } = storeToRefs(authStore);

        const provider = new Navigation({
            isLoggedIn: () => loggedIn.value,
            hasPermission: async (name) => {
                let identity: PolicyIdentity | undefined;
                if (userId.value) {
                    identity = {
                        type: 'user',
                        id: userId.value,
                    };
                }

                return authStore.permissionChecker
                    .preCheck({
                        name,
                        data: {
                            identity,
                        },
                    })
                    .then(() => true)
                    .catch(() => false);
            },
        });

        nuxt.hook('register', (context: ModuleMeta) => {
            if (context.navigationItems) {
                const topNavigationId = context.navigationTopId ||
                    context.name.toLowerCase();

                context.requirePermissions = extractNavigationItemsPermissions(context.navigationItems);

                const topNavigationItem: NavigationItem = {
                    id: topNavigationId,
                    name: context.name,
                    url: context.baseURL,
                    requireLoggedIn: context.requireLoggedIn,
                    requirePermissions: context.requirePermissions,
                };

                if (context.baseURL) {
                    extendNavigationItemsURL(context.navigationItems, context.baseURL);
                }

                provider.addTopElement(topNavigationItem);
                provider.addSideElements(topNavigationId, context.navigationItems);
            }

            moduleStore.register(context);
        });

        nuxt.vueApp.use(installNavigation, {
            provider,
        });
    },
});
