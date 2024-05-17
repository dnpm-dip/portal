import type { ClientError } from 'hapic';
import { isAPIClientErrorPayload } from './helper';

export function extractAPIClientErrorIssues(error: ClientError) {
    const data = error?.response?.data;
    return isAPIClientErrorPayload(data) ?
        data._issues : [];
}
