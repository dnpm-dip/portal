export type NavItem = {
    id?: string,
    name: string,
    icon: string,
    urlSuffix: string
};

export type NavItems = NavItem[];

export type NavOptions = {
    direction?: 'vertical' | 'horizontal',
    prevLink?: boolean | string
};
