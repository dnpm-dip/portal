import { PageMetaKey } from '@dnpm-dip/core';
import { flattenNestedNavigationItems } from '@vue-layout/navigation';
import type { NavigationItem, NavigationProvider } from '@vue-layout/navigation';

export class Navigation implements NavigationProvider {
    protected topElements: NavigationItem[];

    protected sideElements : Record<string, NavigationItem[]>;

    constructor() {
        this.topElements = [{
            id: 'default',
            name: 'Home',
            url: '/',
            rootLink: true,
        }];

        this.sideElements = {
            default: [
                {
                    id: 'default',
                    name: 'Home',
                    icon: 'fa fa-home',
                    url: '/',
                    rootLink: true,
                },
            ],
        };
    }

    addTopElement(element: NavigationItem) {
        this.topElements.push(element);
    }

    addSideElements(id: string, elements: NavigationItem[]) {
        this.sideElements[id] = elements;
    }

    async getItems(tier: number, items: NavigationItem[]) {
        if (tier > 1) {
            return undefined;
        }

        if (tier === 0) {
            return this.topElements;
        }

        let component : NavigationItem;
        if (items.length > 0) {
            [component] = items;
        } else {
            component = { id: 'default' };
        }
        return this.sideElements[component.id || 'default'] || [];
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
