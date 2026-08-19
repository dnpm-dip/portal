import { describe, expect, it } from 'vitest';
import { matchRoute } from '../../../src/testing';

describe('matchRoute', () => {
    it('should capture named parameters', () => {
        const match = matchRoute('GET', '/mtb/queries/abc', { 'GET /mtb/queries/:id': () => ({}) });

        expect(match).not.toBeNull();
        expect(match?.params).toEqual({ id: 'abc' });
    });

    it('should ignore the query string', () => {
        const match = matchRoute('GET', '/mtb/queries/abc?limit=10', { 'GET /mtb/queries/:id': () => ({}) });

        expect(match?.params).toEqual({ id: 'abc' });
    });

    it('should not match a different segment count', () => {
        const match = matchRoute('GET', '/mtb/queries', { 'GET /mtb/queries/:id': () => ({}) });

        expect(match).toBeNull();
    });

    it('should not match a different method', () => {
        const match = matchRoute('POST', '/mtb/queries/abc', { 'GET /mtb/queries/:id': () => ({}) });

        expect(match).toBeNull();
    });

    it('should prefer a specific pattern over the catch-all regardless of key order', () => {
        const specific = () => ({ picked: 'specific' });
        const match = matchRoute('GET', '/mtb/sites', {
            '*': () => ({ picked: 'catch-all' }),
            'GET /mtb/sites': specific,
        });

        expect(match?.handler).toBe(specific);
    });

    it('should fall back to the catch-all when nothing matches', () => {
        const catchAll = () => ({ picked: 'catch-all' });
        const match = matchRoute('GET', '/nowhere', { '*': catchAll });

        expect(match?.handler).toBe(catchAll);
        expect(match?.params).toEqual({});
    });
});
