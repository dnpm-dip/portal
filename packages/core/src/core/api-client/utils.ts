import { hasOwnProperty, isObject } from '../../utils';
import type { APIClientErrorPayload } from './types';

export function isAPIClientErrorPayload(input: unknown) : input is APIClientErrorPayload {
    if (
        !isObject(input) ||
        !hasOwnProperty(input, '_issues') ||
        !Array.isArray(input._issues)
    ) {
        return false;
    }

    for (let i = 0; i < input._issues.length; i++) {
        const issue = input._issues[i];

        if (
            !isObject(issue) ||
            !hasOwnProperty(issue, 'severity') ||
            !hasOwnProperty(issue, 'details')
        ) {
            return false;
        }
    }

    return true;
}
