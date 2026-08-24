import { describe, expect, it } from 'vitest';
import { APIClientErrorIssueSeverity, isAPIClientErrorPayload } from '../../../src/client';

describe('isAPIClientErrorPayload', () => {
    it('should accept a payload with well formed issues', () => {
        const input = {
            issues: [
                { severity: APIClientErrorIssueSeverity.ERROR, details: 'boom' },
                { severity: APIClientErrorIssueSeverity.WARNING, details: 'careful' },
            ],
        };

        expect(isAPIClientErrorPayload(input)).toBe(true);
    });

    it('should accept an empty issue list', () => {
        expect(isAPIClientErrorPayload({ issues: [] })).toBe(true);
    });

    it('should reject a non object input', () => {
        expect(isAPIClientErrorPayload(undefined)).toBe(false);
        expect(isAPIClientErrorPayload(null)).toBe(false);
        expect(isAPIClientErrorPayload('boom')).toBe(false);
    });

    it('should reject an array input', () => {
        expect(isAPIClientErrorPayload([{ severity: 'error', details: 'boom' }])).toBe(false);
    });

    it('should reject a payload without an issues property', () => {
        expect(isAPIClientErrorPayload({ message: 'boom' })).toBe(false);
    });

    it('should reject a payload whose issues are not an array', () => {
        expect(isAPIClientErrorPayload({ issues: { severity: 'error', details: 'boom' } })).toBe(false);
    });

    it('should reject an issue without details', () => {
        expect(isAPIClientErrorPayload({ issues: [{ severity: 'error' }] })).toBe(false);
    });

    it('should reject an issue without severity', () => {
        expect(isAPIClientErrorPayload({ issues: [{ details: 'boom' }] })).toBe(false);
    });

    it('should reject a non object issue', () => {
        expect(isAPIClientErrorPayload({ issues: ['boom'] })).toBe(false);
    });

    it('should only check for the presence of the issue keys, not their values', () => {
        expect(isAPIClientErrorPayload({ issues: [{ severity: undefined, details: undefined }] })).toBe(true);
    });
});
