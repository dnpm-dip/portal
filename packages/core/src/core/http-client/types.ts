import type { HTTPClient } from '@dnpm-dip/http-kit';

export type BaseHTTPClientInstallOptions = {
    baseURL?: string,
    client?: HTTPClient
};
