import type { NuxtPage } from '@nuxt/schema';
import path from 'node:path';
import {
    encodePath,
    joinURL,
    withLeadingSlash,
    withoutTrailingSlash,
} from 'ufo';
import { SegmentTokenType } from './constants';
import type {
    NuxtPagesGenerateContext, RoutesPrepareContext, ScannedFile, SegmentToken,
} from './types';
import { parseSegment } from './segment';

export function escapeStringRegexp(input: string) {
    return input
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .replace(/-/g, '\\x2d');
}

export async function generateNuxtPages(context: NuxtPagesGenerateContext) : Promise<NuxtPage[]> {
    const files: ScannedFile[] = context.files
        .map(
            (file) => ({
                relativePath: path.posix.relative(context.directory, file),
                absolutePath: file,
            }),
        ).sort((
            a,
            b,
        ) => a.relativePath.localeCompare(b.relativePath));

    const prefix = withoutTrailingSlash(context.prefix);

    const routes: NuxtPage[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const segments = file.relativePath
            .replace(new RegExp(`${escapeStringRegexp(path.extname(file.relativePath))}$`), '')
            .split('/');

        const route: NuxtPage = {
            name: prefix,
            path: prefix,
            file: file.absolutePath,
            children: [],
        };

        let parent = routes;

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            const tokens = parseSegment(segment);
            const segmentName = tokens.map(({ value }) => value).join('');

            // ex: parent/[slug].vue -> parent-slug
            route.name += (route.name && '/') + segmentName;

            // ex: parent.vue + parent/child.vue
            const path = withLeadingSlash(joinURL(route.path, generateRoutePath(tokens).replace(/\/index$/, '/')));
            const child = parent.find((
                parentRoute,
            ) => parentRoute.name === route.name && parentRoute.path === path);

            if (child && child.children) {
                parent = child.children;
                route.path = '';
            } else if (segmentName === 'index' && !route.path) {
                route.path += '/';
            } else if (segmentName !== 'index') {
                route.path += generateRoutePath(tokens);
            }
        }

        parent.push(route);
    }

    return prepareRoutes({
        routes,
    });
}

function prepareRoutes(context : RoutesPrepareContext) {
    for (let i = 0; i < context.routes.length; i++) {
        const route = context.routes[i];

        // Remove -index
        if (route.name) {
            route.name = route.name
                .replace(/\/index$/, '')
                .replace(/\//g, '-');
        }

        // Remove leading / if children route
        if (context.parent && route.path.startsWith('/')) {
            route.path = route.path.slice(1);
        }

        if (route.children) {
            if (route.children.length > 0) {
                route.children = prepareRoutes({
                    routes: route.children,
                    parent: route,
                });
            }

            const index = route.children.findIndex(
                (childRoute) => childRoute.path === '',
            );

            if (index !== -1) {
                route.name = undefined;
            }
        }

        context.routes[i] = route;
    }

    return context.routes;
}

function generateRoutePath(tokens: SegmentToken[]): string {
    return tokens.reduce((path, token) => {
        let suffix : string;

        switch (token.type) {
            case SegmentTokenType.optional: {
                suffix = `:${token.value}?`;
                break;
            }
            case SegmentTokenType.dynamic: {
                suffix = `:${token.value}()`;
                break;
            }
            case SegmentTokenType.catchall: {
                suffix = `:${token.value}(.*)*`;
                break;
            }
            default: {
                suffix = encodePath(token.value).replace(/:/g, '\\:');
                break;
            }
        }

        return path + suffix;
    }, '/');
}
