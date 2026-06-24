/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { inject, provide } from '@dnpm-dip/core';
import type { App } from 'vue';
import type { Navigation } from './module';

export const NavigationSymbol = Symbol.for('Navigation');

export function provideNavigation(navigation: Navigation, app?: App) {
    provide(NavigationSymbol, navigation, app);
}

export function injectNavigation(app?: App) : Navigation {
    const instance = inject<Navigation>(NavigationSymbol, app);
    if (!instance) {
        throw new Error('The Navigation is not set.');
    }

    return instance;
}
