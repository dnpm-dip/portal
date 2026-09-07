import type { IHTTPClient } from '@dnpm-dip/http-kit';

export type BaseHTTPClientInstallOptions = {
    baseURL?: string,
    client?: IHTTPClient
};
