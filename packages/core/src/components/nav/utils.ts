import { MyLink } from '@vue-layout/navigation';
import { h } from 'vue';
import type { VNodeChild } from 'vue';
import type { NavItem, NavOptions } from './types';

export function buildNav(
    path: string,
    items: NavItem[],
    options?: NavOptions,
) {
    options = options || {};

    const clazz : string[] = [
        'nav nav-pills',
    ];

    switch (options.direction) {
        case 'vertical':
            clazz.push('flex-column');
            break;
    }

    let prevLink : VNodeChild = [];
    if (options.prevLink) {
        let baseLink : string;
        if (typeof options.prevLink === 'string') {
            baseLink = options.prevLink;
        } else {
            const lastIndex = path.lastIndexOf('/');
            baseLink = path.substring(0, lastIndex);
        }

        prevLink = h('li', { class: 'nav-item' }, [
            h(
                MyLink,
                {
                    class: 'nav-link',
                    to: baseLink,
                },
                {
                    default: () => [
                        h('i', { class: 'fa fa-arrow-left' }),
                    ],
                },
            ),
        ]);
    }

    const buildLink = (link: string) => {
        if (link.length === 0) {
            return path;
        }

        if (link.substring(0, 1) === '/') {
            return `${path}${link}`;
        }

        return `${path}/${link}`;
    };

    return h(
        'ul',
        { class: clazz },
        [
            prevLink,
            ...items.map((item) => h('li', { class: 'nav-item' }, [
                h(
                    MyLink,
                    {
                        class: 'nav-link',
                        to: buildLink(item.urlSuffix),
                    },
                    {
                        default: () => [
                            h('i', { class: `${item.icon} pe-1` }),
                            item.name,
                        ],
                    },
                ),
            ])),
        ],
    );
}
