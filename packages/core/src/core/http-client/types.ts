import type { ClientOptionsInput } from 'hapic';
import type { APIClientErrorIssueSeverity } from './constants';
import type { HTTPClient } from './module';

export type HTTPClientOptions = ClientOptionsInput;

export type HTTPClientErrorIssue = {
    severity: APIClientErrorIssueSeverity,
    details: string
};

export type HTTPClientErrorPayload = {
    issues: HTTPClientErrorIssue[],
};

export type BaseHTTPClientInstallOptions = {
    baseURL?: string,
    client?: HTTPClient
};
