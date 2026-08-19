import type { ClientOptionsInput, IClient } from 'hapic';
import type {
    ICodeSystemAPI,
    IQueryAPI,
    ISiteAPI,
    IValueSetAPI,
} from '../domains';
import type { APIClientErrorIssueSeverity } from './constants';

export type HTTPClientOptions = ClientOptionsInput;

export type HTTPClientErrorIssue = {
    severity: APIClientErrorIssueSeverity,
    details: string
};

export type HTTPClientErrorPayload = {
    issues: HTTPClientErrorIssue[],
};

export interface IHTTPClient extends IClient {
    readonly codeSystem : ICodeSystemAPI;
    readonly query : IQueryAPI;
    readonly site : ISiteAPI;
    readonly valueSet : IValueSetAPI;
}
