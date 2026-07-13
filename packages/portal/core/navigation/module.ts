/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Store } from '@authup/client-web-kit';
import { StoreAuthStatus } from '@authup/client-web-kit';
import type { IdentityPolicyData } from '@authup/access';
import { BuiltInPolicyType, PolicyData } from '@authup/access';
import type { NavigationItemMeta } from '@dnpm-dip/core';
import { PageMetaKey } from '@dnpm-dip/core';
import type { NavigationItem } from '@vuecs/navigation';

const TopDefaultName = 'Home';

export const LayoutTopNavigationRegistryId = 'top';

export class Navigation {
    protected topElements: NavigationItem[];

    protected sideElements : Record<string, NavigationItem[]>;

    protected store : Store;

    protected initialized: boolean;

    constructor(store: Store) {
        this.store = store;
        this.initialized = false;

        this.topElements = [
            {
                name: TopDefaultName,
                url: '/',
            },
        ];

        this.sideElements = {
            [TopDefaultName]: [
                {
                    name: 'Home',
                    icon: 'fa6-solid:house',
                    url: '/',
                    meta: { [PageMetaKey.REQUIRED_LOGGED_IN]: true },
                },
                {
                    name: 'Login',
                    type: 'link',
                    url: '/login',
                    icon: 'fa6-solid:right-to-bracket',
                    meta: { [PageMetaKey.REQUIRED_LOGGED_OUT]: true },
                },
                {
                    name: 'Settings',
                    type: 'link',
                    url: '/settings',
                    icon: 'fa6-solid:gear',
                    meta: { [PageMetaKey.REQUIRED_LOGGED_IN]: true },
                },
                {
                    name: 'Logout',
                    type: 'link',
                    url: '/logout',
                    icon: 'fa6-solid:power-off',
                    meta: { [PageMetaKey.REQUIRED_LOGGED_IN]: true },
                },
            ],
        };
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        try {
            await this.store.resolve();
        } catch {
            // do nothing :)
        }
    }

    addTopElement(element: NavigationItem) {
        this.topElements.push(element);
    }

    addSideElements(id: string, elements: NavigationItem[]) {
        this.sideElements[id] = elements;
    }

    getTopItems(): Promise<NavigationItem[]> {
        return this.reduce(this.topElements);
    }

    getSideItems(activeTopName?: string): Promise<NavigationItem[]> {
        const elements = (activeTopName ? this.sideElements[activeTopName] : undefined) ??
            this.sideElements[TopDefaultName] ??
            [];

        return this.reduce(elements);
    }

    protected async reduce(items: NavigationItem[]) : Promise<NavigationItem[]> {
        await this.initialize();

        const promises = items.map(
            (item) => this.reduceItem(item),
        );

        const output = await Promise.all(promises);

        return output.filter((item) => !!item);
    }

    protected async reduceItem(item: NavigationItem<NavigationItemMeta>) : Promise<NavigationItem | undefined> {
        if (!item.meta) {
            return item;
        }

        const authenticated = this.store.status === StoreAuthStatus.AUTHENTICATED;
        let identity: IdentityPolicyData | undefined;
        if (this.store.userId) {
            identity = {
                type: 'user',
                id: this.store.userId,
            };
        }

        if (
            typeof item.meta.requireLoggedIn !== 'undefined' &&
            item.meta.requireLoggedIn &&
            !authenticated
        ) {
            return undefined;
        }

        if (
            typeof item.meta.requireLoggedOut !== 'undefined' &&
            item.meta.requireLoggedOut &&
            authenticated
        ) {
            return undefined;
        }

        let canPass = true;

        if (item.meta.requirePermissions) {
            let permissions : string[];
            if (Array.isArray(item.meta.requirePermissions)) {
                permissions = item.meta.requirePermissions;
            } else {
                permissions = [item.meta.requirePermissions];
            }

            if (permissions.length > 0) {
                try {
                    const data = new PolicyData();
                    data.set(BuiltInPolicyType.IDENTITY, identity);
                    await this.store.permissionEvaluator.preEvaluateOneOf({
                        name: permissions,
                        data,
                    });
                } catch {
                    canPass = false;
                }
            }
        }

        if (canPass) {
            if (item.children) {
                item.children = await this.reduce(item.children);
            }

            return item;
        }

        return undefined;
    }
}
