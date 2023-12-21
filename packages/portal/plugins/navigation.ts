import type { HookResult } from '@nuxt/schema';
import type { NavigationItem } from '@vuecs/navigation';
import installNavigation from '@vuecs/navigation';
import { defineNuxtPlugin, useRoute } from '#app';
import { Navigation } from '../core';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'navigation': (element: NavigationItem) => HookResult
    }
}

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        const provider = new Navigation();

        nuxt.hook('navigation', (data: NavigationItem) => {
            const { children, ...props } = data;
            provider.addTopElement(props);
            if (props.id) {
                provider.addSideElements(`${props.id}`, children || []);
            }
        });

        nuxt.vueApp.use(installNavigation, {
            provider,
        });
    },
});
