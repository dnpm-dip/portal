import type { HookResult } from '@nuxt/schema';
import type { NavigationElement, NavigationStore } from '@vue-layout/navigation';
import installNavigation from '@vue-layout/navigation';
import { defineNuxtPlugin, useRoute } from '#app';
import { Navigation } from '../core';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'navigation': (element: NavigationElement) => HookResult
    }
}

export default defineNuxtPlugin({
    enforce: 'pre',
    async setup(nuxt) {
        const provider = new Navigation();

        nuxt.hook('navigation', (data: NavigationElement) => {
            const { children, ...props } = data;
            provider.addTopElement(props);
            if (props.id) {
                provider.addSideElements(`${props.id}`, children || []);
            }
        });

        const store = useState<NavigationStore>(() => ({
            items: [],
            itemsActive: [],
        }));

        nuxt.vueApp.use(installNavigation, {
            store,
            provider,
        });
    },
});
