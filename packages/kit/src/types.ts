import type { NavigationItem } from '@vuecs/navigation';

export type RegistrationContext = {
    name: string,
    description?: string,
    baseURL: string,
    navigationItems?: NavigationItem[]
    navigationTopId?: string,
    rootDir?: string | URL
};
