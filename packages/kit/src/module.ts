import {
    addPluginTemplate,
    createResolver,
    resolveFiles,
    useNuxt,
} from '@nuxt/kit';
import { generateNuxtPages } from './core';
import type { RegistrationContext } from './types';

export async function register(context: RegistrationContext) {
    const nuxt = useNuxt();

    const resolver = createResolver(context.rootDir || import.meta.url);

    const directory = resolver.resolve('./runtime/pages');
    const files = await resolveFiles(directory, '**/*{.vue,.ts}');

    let prefix : string = context.baseURL;
    if (prefix.endsWith('/')) {
        prefix = prefix.substring(0, prefix.length - 1);
    }

    const pages = await generateNuxtPages({
        directory,
        files,
        prefix,
    });

    nuxt.hook('pages:extend', (items) => {
        items.push(...pages);
    });

    if (context.navigationItems) {
        context.navigationItems = context.navigationItems
            .map((item) => {
                item.url = context.baseURL + item.url;

                return item;
            });
    }

    addPluginTemplate({
        options: {
            items: context.navigationItems,
        },
        filename: `${context.name.toLowerCase()}.js`,
        getContents() {
            return `
                import { defineNuxtPlugin } from '#imports'

                export default defineNuxtPlugin({
                    enforce: 'post',
                    async setup(nuxt) {
                        nuxt.callHook(
                            'register',
                            JSON.parse('${JSON.stringify(context)}')
                        );
                    }
                })
                `;
        },
    });
}
