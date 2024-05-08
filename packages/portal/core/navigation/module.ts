import { PermissionName } from '@authup/core-kit';
import { PageMetaKey, PageNavigationTopID } from '@dnpm-dip/core';
import type { NavigationItem, NavigationProvider } from '@vuecs/navigation';
import { flattenNestedNavigationItems } from '@vuecs/navigation';
import { reduceNavigationElementsByRestriction } from './utils';

type NavigationContext = {
    hasPermission: (name: string) => boolean,
    isLoggedIn: () => boolean
};

export class Navigation implements NavigationProvider {
    protected topElements: NavigationItem[];

    protected sideElements : Record<string, NavigationItem[]>;

    protected context : NavigationContext;

    constructor(context: NavigationContext) {
        this.context = context;

        this.topElements = [
            {
                id: PageNavigationTopID.DEFAULT,
                name: 'Home',
                url: '/',
                rootLink: true,
            },
            {
                id: PageNavigationTopID.ADMIN,
                name: 'Admin',
                rootLink: true,
                [PageMetaKey.REQUIRED_LOGGED_IN]: true,
            },
        ];

        this.sideElements = {
            default: [
                {
                    id: 'default',
                    name: 'Home',
                    icon: 'fa fa-home',
                    url: '/',
                    rootLink: true,
                },
                {
                    name: 'Login',
                    type: 'link',
                    url: '/login',
                    icon: 'fas fa-sign',
                    [PageMetaKey.REQUIRED_LOGGED_OUT]: true,
                },
                {
                    name: 'Logout',
                    type: 'link',
                    url: '/logout',
                    icon: 'fa fa-power-off',
                    [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                },
            ],
            admin: [
                {
                    name: 'Identitätsanbieter',
                    type: 'link',
                    url: '/admin/identity-providers',
                    icon: 'fa-solid fa-atom',
                    [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    [PageMetaKey.REQUIRED_PERMISSIONS]: [
                        PermissionName.PROVIDER_ADD,
                        PermissionName.PROVIDER_EDIT,
                        PermissionName.PROVIDER_DROP,
                    ],
                },
                {
                    name: 'Benutzer',
                    type: 'link',
                    url: '/admin/users',
                    icon: 'fas fa-user',
                    [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    [PageMetaKey.REQUIRED_PERMISSIONS]: [
                        PermissionName.USER_ADD,
                        PermissionName.USER_EDIT,
                        PermissionName.USER_DROP,
                    ],
                },
                {
                    name: 'Rollen',
                    type: 'link',
                    url: '/admin/roles',
                    icon: 'fa-solid fa-theater-masks',
                    [PageMetaKey.REQUIRED_LOGGED_IN]: true,
                    [PageMetaKey.REQUIRED_PERMISSIONS]: [
                        PermissionName.ROLE_ADD,
                        PermissionName.ROLE_EDIT,
                        PermissionName.ROLE_DROP,
                        PermissionName.ROLE_PERMISSION_ADD,
                        PermissionName.ROLE_PERMISSION_DROP,
                    ],
                },
            ],
        };
    }

    addTopElement(element: NavigationItem) {
        this.topElements.splice(this.topElements.length - 1, 0, element);
    }

    addSideElements(id: string, elements: NavigationItem[]) {
        this.sideElements[id] = elements;
    }

    async getItems(tier: number, items: NavigationItem[]) {
        if (tier > 1) {
            return undefined;
        }

        if (tier === 0) {
            return reduceNavigationElementsByRestriction(this.topElements, {
                hasPermission: (name: string) => this.context.hasPermission(name),
                isLoggedIn: () => this.context.isLoggedIn(),
            });
        }

        let component : NavigationItem;
        if (items.length > 0) {
            [component] = items;
        } else {
            component = { id: 'default' };
        }

        return reduceNavigationElementsByRestriction(this.sideElements[component.id || 'default'] || [], {
            hasPermission: (name: string) => this.context.hasPermission(name),
            isLoggedIn: () => this.context.isLoggedIn(),
        });
    }

    async getItemsActiveByRoute(route) {
        const {
            [PageMetaKey.NAVIGATION_TOP_ID]: topId,
            [PageMetaKey.NAVIGATION_SIDE_ID]: sideId,
        } = route.meta;

        const url = route.fullPath;

        const keys = Object.keys(this.sideElements);
        for (let i = 0; i < keys.length; i++) {
            const items = flattenNestedNavigationItems(this.sideElements[keys[i]])
                .sort((a: NavigationItem, b: NavigationItem) => {
                    if (a.root && !b.root) {
                        return 1;
                    }

                    if (!a.root && b.root) {
                        return -1;
                    }

                    return (b.url?.length ?? 0) - (a.url?.length ?? 0);
                })
                .filter((item) => {
                    if (sideId) {
                        if (item.id === sideId) {
                            return true;
                        }
                    }

                    if (!item.url) return false;

                    if (item.rootLink) {
                        return url === item.url;
                    }

                    return url === item.url || url.startsWith(item.url);
                });

            if (items.length === 0) {
                continue;
            }

            const topIndex = this.topElements.findIndex(
                (el) => (topId && topId === el.id) || el.id === keys[i],
            );

            if (topIndex === -1) {
                continue;
            }

            return [
                this.topElements[topIndex],
                items[0],
            ];
        }

        const topIndex = this.topElements.findIndex(
            (el) => topId && topId === el.id,
        );
        if (topIndex !== -1) {
            return [
                this.topElements[topIndex],
            ];
        }

        return [];
    }
}
