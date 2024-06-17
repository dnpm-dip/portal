import type { RequestBaseOptions } from 'hapic';
import type { APIClientErrorIssueSeverity } from './constants';

export type HTTPClientOptions = RequestBaseOptions;

export type HTTPClientErrorIssue = {
    severity: APIClientErrorIssueSeverity,
    details: string
};

export type HTTPClientErrorPayload = {
    issues: HTTPClientErrorIssue[],
};

export type BaseHTTPClientInstallOptions = {
    baseURL?: string
};
