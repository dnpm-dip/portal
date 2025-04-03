/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Store } from '@authup/client-web-kit';
import type { PolicyIdentity } from '@authup/access';
import type { NavigationItemMeta } from '@dnpm-dip/core';
import { PageMetaKey } from '@dnpm-dip/core';
import type { NavigationItem, NavigationItemNormalized } from '@vuecs/navigation';

const TopDefaultName = 'Home';

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
                    icon: 'fa fa-home',
                    url: '/',
                    meta: {
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    },
                },
                {
                    name: 'Login',
                    type: 'link',
                    url: '/login',
                    icon: 'fas fa-sign',
                    meta: {
                        [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
                    },
                }, {
                    name: 'Settings',
                    type: 'link',
                    url: '/settings',
                    icon: 'fas fa-cog',
                    meta: {
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    },
                },
                {
                    name: 'Logout',
                    type: 'link',
                    url: '/logout',
                    icon: 'fa fa-power-off',
                    meta: {
                        [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    },
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
        } catch (e) {
            // do nothing :)
        }
    }

    addTopElement(element: NavigationItem) {
        this.topElements.push(element);
    }

    addSideElements(id: string, elements: NavigationItem[]) {
        this.sideElements[id] = elements;
    }

    async getItems(level: number, parent?: NavigationItemNormalized): Promise<NavigationItem[]> {
        if (level === 0) {
            return this.reduce(this.topElements);
        }

        if (parent) {
            if (level === 1) {
                if (this.sideElements[parent.name]) {
                    return this.reduce(this.sideElements[parent.name]);
                }

                return this.reduce(this.sideElements[TopDefaultName]);
            }
        }

        return [];
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

        const { loggedIn } = this.store;
        let identity: PolicyIdentity | undefined;
        if (this.store.userId) {
            identity = {
                type: 'user',
                id: this.store.userId,
            };
        }

        if (
            typeof item.meta.requireLoggedIn !== 'undefined' &&
            item.meta.requireLoggedIn &&
            !loggedIn
        ) {
            return undefined;
        }

        if (
            typeof item.meta.requireLoggedOut !== 'undefined' &&
            item.meta.requireLoggedOut &&
            loggedIn
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
                    await this.store.permissionChecker.preCheckOneOf({
                        name: permissions,
                        data: {
                            identity,
                        },
                    });
                } catch (e) {
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
