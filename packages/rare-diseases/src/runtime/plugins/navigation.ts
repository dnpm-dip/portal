import type { HookResult } from '@nuxt/schema';
import type { NavigationElement } from '@vue-layout/navigation';
import { defineNuxtPlugin } from '#app';

declare module '#app' {
    interface RuntimeNuxtHooks {
        'navigation': (element: NavigationElement) => HookResult
    }
}

export default defineNuxtPlugin({
    enforce: 'post',
    async setup(nuxt) {
        const elements : NavigationElement = {
            id: 'rd',
            name: 'RD',
            url: '/rd/',
            children: [
                {
                    id: 'rd-home',
                    name: 'Home',
                    icon: 'fa fa-home',
                    url: '/rd/',
                    rootLink: true,
                },
                {
                    id: 'rd-search',
                    name: 'Suche',
                    icon: 'fa fa-search',
                    url: '/rd/search',
                },
            ],
        };

        nuxt.callHook('navigation', elements);
    },
});
