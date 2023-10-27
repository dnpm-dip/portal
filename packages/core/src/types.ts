import type { APIClient } from './core';

export type ObjectLiteral = Record<string, any>;
export type InstallOptions = {
    apiClient?: APIClient
};
