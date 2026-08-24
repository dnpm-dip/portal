import { describe, expect, it } from 'vitest';
import { HGVS_CODE_REGEX, transformConceptToFormSelectOption } from '../../../src/domains';

describe('transformConceptToFormSelectOption', () => {
    it('should map a concept onto its code and display', () => {
        const output = transformConceptToFormSelectOption({
            code: 'C25.0',
            display: 'Pankreaskopf',
            properties: { name: 'Bösartige Neubildung' },
        });

        expect(output).toEqual({ value: 'C25.0', label: 'Pankreaskopf' });
    });

    it('should ignore the concept properties', () => {
        const output = transformConceptToFormSelectOption({
            code: 'C25.0', 
            display: 'Pankreaskopf', 
            properties: {}, 
        });

        expect(output).toEqual({ value: 'C25.0', label: 'Pankreaskopf' });
    });
});

describe('HGVS_CODE_REGEX', () => {
    it('should match a three letter amino acid code case-insensitively', () => {
        HGVS_CODE_REGEX.lastIndex = 0;

        expect(HGVS_CODE_REGEX.test('p.Gly12Cys')).toBe(true);

        HGVS_CODE_REGEX.lastIndex = 0;

        expect(HGVS_CODE_REGEX.test('p.gly12cys')).toBe(true);
    });

    it('should not match a nucleotide level notation', () => {
        HGVS_CODE_REGEX.lastIndex = 0;

        expect(HGVS_CODE_REGEX.test('c.123A>T')).toBe(false);
    });

    // The constant is a shared global regex: `test` advances `lastIndex`, so every
    // consumer has to reset it before use (mtb/rd do exactly this).
    it('should carry lastIndex across calls', () => {
        HGVS_CODE_REGEX.lastIndex = 0;

        expect(HGVS_CODE_REGEX.test('Gly')).toBe(true);
        expect(HGVS_CODE_REGEX.test('Gly')).toBe(false);
    });
});
