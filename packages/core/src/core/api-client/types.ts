import type { RequestBaseOptions } from 'hapic';

export type APIClientConfigInput = RequestBaseOptions;

// todo: what options are there?
export type APIClientErrorIssueSeverity = 'error' | 'warning';

export type APIClientErrorIssue = {
    severity: APIClientErrorIssueSeverity,
    details: string
};

export type APIClientErrorPayload = {
    issues: APIClientErrorIssue[],
};
