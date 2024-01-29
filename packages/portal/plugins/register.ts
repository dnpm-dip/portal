import type { RegistrationContext } from '@dnpm-dip/kit';
import type { HookResult } from '@nuxt/schema';
import type { NavigationItem } from '@vuecs/navigation';
import installNavigation from '@vuecs/navigation';
import { defineNuxtPlugin } from '#app';
import { Navigation } from '../core';
import { useModuleStore } from '../stores/modules';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'register': (element: RegistrationContext) => HookResult
    }
}

export default defineNuxtPlugin<Record<string, any>>({
    enforce: 'pre',
    async setup(nuxt) {
        const moduleStore = useModuleStore(nuxt.$pinia);
        const provider = new Navigation();

        nuxt.hook('register', (context: RegistrationContext) => {
            if (context.navigationItems) {
                const topNavigationId = context.navigationTopId ||
                    context.name.toLowerCase();
                const topNavigationItem: NavigationItem = {
                    id: topNavigationId,
                    name: context.name,
                    url: context.baseURL,
                };

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
