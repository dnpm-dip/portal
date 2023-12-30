import type { HookResult } from '@nuxt/schema';
import type { NavigationItem } from '@vuecs/navigation';
import installNavigation from '@vuecs/navigation';
import { defineNuxtPlugin } from '#app';
import { Navigation } from '../core';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'navigationSideItems': (parentId: string, element: NavigationItem[]) => HookResult
        'navigationTopItem': (element: NavigationItem) => HookResult
    }
}

export default defineNuxtPlugin<Record<string, any>>({
    enforce: 'pre',
    async setup(nuxt) {
        const provider = new Navigation();

        nuxt.hook('navigationTopItem', (data: NavigationItem) => {
            provider.addTopElement(data);
        });

        nuxt.hook('navigationSideItems', (parentId: string, data: NavigationItem[]) => {
            provider.addSideElements(parentId, data);
        });

        nuxt.vueApp.use(installNavigation, {
            provider,
        });
    },
});
