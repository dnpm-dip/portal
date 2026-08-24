import type { ClientError } from 'hapic';
import { isClientError } from 'hapic';
import { describe, expect, it } from 'vitest';
import { extractAPIClientErrorIssues } from '../../../src/client';
import { createFakeClient, fakeResponse } from '../../../src/testing';

describe('extractAPIClientErrorIssues', () => {
    it('should read the portal issues off a real hapic client error', async () => {
        const client = createFakeClient({
            handlers: {
                'GET /mtb/sites': () => fakeResponse(400, {
                    issues: [
                        { severity: 'error', details: 'Standort nicht erreichbar' },
                        { severity: 'warning', details: 'Teilergebnis' },
                    ],
                }),
            },
        });

        let error : unknown;
        try {
            await client.site.getItems('mtb');
        } catch (e) {
            error = e;
        }

        expect(isClientError(error)).toBe(true);
        expect((error as ClientError).status).toBe(400);

        const issues = extractAPIClientErrorIssues(error as ClientError);

        expect(issues).toHaveLength(2);
        expect(issues[0]?.severity).toBe('error');
        expect(issues[0]?.details).toBe('Standort nicht erreichbar');
        expect(issues[1]?.severity).toBe('warning');
    });

    it('should return an empty list for an error payload that is not a portal issue payload', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/sites': () => fakeResponse(500, { message: 'Interner Fehler' }) } });

        let error : unknown;
        try {
            await client.site.getItems('mtb');
        } catch (e) {
            error = e;
        }

        expect(isClientError(error)).toBe(true);
        expect(extractAPIClientErrorIssues(error as ClientError)).toEqual([]);
    });

    it('should return an empty list when the error carries no response', () => {
        expect(extractAPIClientErrorIssues({} as ClientError)).toEqual([]);
    });

    it('should return an empty list when no error is given', () => {
        expect(extractAPIClientErrorIssues(undefined as unknown as ClientError)).toEqual([]);
    });
});
