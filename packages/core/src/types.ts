/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItem } from '@vuecs/navigation';
import type { ModuleType } from './constants';
import type { PageMetaKey } from './core';

export type ObjectLiteral = Record<string, any>;
export type InstallOptions = {
    baseURL: string
};

export type ModuleMeta = {
    type?: `${ModuleType}`,
    name: string,
    description?: string,
    baseURL: string,
    navigationItems?: NavigationItem[]
    navigationTopId?: string,
    [PageMetaKey.REQUIRED_LOGGED_IN]?: boolean,
    [PageMetaKey.REQUIRED_PERMISSIONS]?: string[]
};
