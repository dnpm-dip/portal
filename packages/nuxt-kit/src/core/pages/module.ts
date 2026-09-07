/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createResolver, resolveFiles, useNuxt } from '@nuxt/kit';
import { generateNuxtPages } from './generate';
import type { PagesRegisterContext } from './types';

export async function registerPages(ctx: PagesRegisterContext) {
    const nuxt = useNuxt();

    const resolver = createResolver(ctx.rootDir || import.meta.url);

    const directory = resolver.resolve('./runtime/pages');
    const files = await resolveFiles(directory, '**/*{.vue,.ts}');

    let prefix : string = ctx.baseURL;
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
}
