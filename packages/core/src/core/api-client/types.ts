import type { RequestBaseOptions } from 'hapic';
import type { APIClientErrorIssueSeverity } from './constants';

export type APIClientConfigInput = RequestBaseOptions;

export type APIClientErrorIssue = {
    severity: APIClientErrorIssueSeverity,
    details: string
};

export type APIClientErrorPayload = {
    issues: APIClientErrorIssue[],
};
