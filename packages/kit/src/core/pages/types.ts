import type { NuxtPage } from '@nuxt/schema';
import type { SegmentTokenType } from './constants';

export type ScannedFile = {
    relativePath: string
    absolutePath: string
};

export type SegmentToken = {
    type: SegmentTokenType
    value: string
};

export type NuxtPagesGenerateContext = {
    directory: string,
    files: string[],
    prefix: string
};

export type RoutesPrepareContext = {
    routes: NuxtPage[],
    parent?: NuxtPage
};
