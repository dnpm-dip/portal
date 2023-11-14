import type { ClientError } from 'hapic';
import { isAPIClientErrorPayload } from './utils';

export function extractAPIClientErrorIssues(error: ClientError) {
    const data = error?.response?.data;
    return isAPIClientErrorPayload(data) ?
        data.issues : [];
}
