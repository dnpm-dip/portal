/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItem } from '@vuecs/navigation';
import type { HTTPClient } from '@dnpm-dip/http-kit';
import type { ModuleType } from './constants';
import type { PageMetaKey } from './core';

export type { ObjectLiteral } from '@dnpm-dip/kit';
export type InstallOptions = {
    baseURL: string,
    httpClient?: HTTPClient
};

export type NavigationItemMeta = {
    [PageMetaKey.REQUIRED_LOGGED_IN]?: boolean,
    [PageMetaKey.REQUIRED_LOGGED_OUT]?: boolean,
    [PageMetaKey.REQUIRED_PERMISSIONS]?: string | string[],
};

export type ModuleMeta = {
    type?: `${ModuleType}`,
    name: string,
    description?: string,
    baseURL: string,
    navigationItems?: NavigationItem<NavigationItemMeta>[]
    [PageMetaKey.REQUIRED_LOGGED_IN]?: boolean,
    [PageMetaKey.REQUIRED_PERMISSIONS]?: string[]
};
