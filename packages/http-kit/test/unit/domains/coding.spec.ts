import { describe, expect, it } from 'vitest';
import {
    buildCodingsRecord,
    extractCodeFromCodingsRecord,
    isCoding,
    serializeCoding,
    toCoding,
    transformFormSelectOptionsToCodings,
} from '../../../src/domains';

describe('isCoding', () => {
    it('should accept a record with a string or numeric code', () => {
        expect(isCoding({ code: 'male' })).toBe(true);
        expect(isCoding({ code: 42 })).toBe(true);
    });

    it('should reject a record without a usable code', () => {
        expect(isCoding({ code: true })).toBe(false);
        expect(isCoding({ display: 'male' })).toBe(false);
    });

    it('should reject non records', () => {
        expect(isCoding(undefined)).toBe(false);
        expect(isCoding(null)).toBe(false);
        expect(isCoding('male')).toBe(false);
        expect(isCoding([{ code: 'male' }])).toBe(false);
    });
});

describe('toCoding', () => {
    it('should wrap a scalar into a coding', () => {
        expect(toCoding('male')).toEqual({ code: 'male' });
        expect(toCoding(42)).toEqual({ code: 42 });
    });

    it('should pass an existing coding through untouched', () => {
        const input = {
            code: 'male', 
            display: 'männlich', 
            system: 'urn:gender', 
        };

        expect(toCoding(input)).toBe(input);
    });
});

describe('transformFormSelectOptionsToCodings', () => {
    it('should stringify every option value into a coding code', () => {
        const output = transformFormSelectOptionsToCodings([
            { value: 'male', label: 'männlich' },
            { value: 42, label: 'zweiundvierzig' },
        ]);

        expect(output).toEqual([{ code: 'male' }, { code: '42' }]);
    });

    it('should return an empty list for no options', () => {
        expect(transformFormSelectOptionsToCodings([])).toEqual([]);
    });
});

describe('extractCodeFromCodingsRecord', () => {
    it('should reduce a coding to its code', () => {
        const output = extractCodeFromCodingsRecord({ gender: { code: 'male', display: 'männlich' } });

        expect(output).toEqual({ gender: 'male' });
    });

    it('should reduce a coding list to its codes and drop non codings', () => {
        const output = extractCodeFromCodingsRecord({ site: [{ code: 'site-a' }, 'site-b', { code: 'site-c' }] as any });

        expect(output).toEqual({ site: ['site-a', 'site-c'] });
    });

    it('should pass a scalar value through unchanged', () => {
        const output = extractCodeFromCodingsRecord({ supportingVariants: true, name: 'Abfrage' });

        expect(output).toEqual({ supportingVariants: true, name: 'Abfrage' });
    });

    it('should return an empty record for an empty input', () => {
        expect(extractCodeFromCodingsRecord({})).toEqual({});
    });
});

describe('buildCodingsRecord', () => {
    it('should wrap a non empty string into a coding', () => {
        expect(buildCodingsRecord({ gender: 'male' })).toEqual({ gender: { code: 'male' } });
    });

    it('should drop an empty string', () => {
        expect(buildCodingsRecord({ gender: '' })).toEqual({});
    });

    it('should strip everything but the code off an existing coding', () => {
        const output = buildCodingsRecord({
            gender: {
                code: 'male', 
                display: 'männlich', 
                system: 'urn:gender', 
            }, 
        });

        expect(output).toEqual({ gender: { code: 'male' } });
    });

    it('should stringify a form select option value', () => {
        expect(buildCodingsRecord({ gender: { value: 42, label: 'zweiundvierzig' } })).toEqual({ gender: { code: '42' } });
    });

    it('should map a list of form select options and scalars into codings', () => {
        const output = buildCodingsRecord({ site: [{ value: 'site-a', label: 'Standort A' }, 'site-b'] });

        expect(output).toEqual({ site: [{ code: 'site-a' }, { code: 'site-b' }] });
    });

    it('should not stringify an option value inside a list, unlike a single option', () => {
        expect(buildCodingsRecord({ site: [{ value: 42, label: 'zweiundvierzig' }] })).toEqual({ site: [{ code: 42 }] });
    });

    it('should keep a boolean value as is', () => {
        expect(buildCodingsRecord({ supportingVariants: false })).toEqual({ supportingVariants: false });
    });

    it('should drop a value that is neither coding, option, string nor boolean', () => {
        expect(buildCodingsRecord({ limit: 10 })).toEqual({});
    });
});

describe('serializeCoding', () => {
    it('should serialize a bare code', () => {
        expect(serializeCoding({ code: 'male' })).toBe('male');
    });

    it('should append the system', () => {
        expect(serializeCoding({ code: 'male', system: 'urn:gender' })).toBe('male|urn:gender');
    });

    it('should append system and version', () => {
        expect(serializeCoding({
            code: 'male', 
            system: 'urn:gender', 
            version: '2.0', 
        })).toBe('male|urn:gender|2.0');
    });

    it('should drop a version that has no system', () => {
        expect(serializeCoding({ code: 'male', version: '2.0' })).toBe('male');
    });

    it('should stringify a numeric code', () => {
        expect(serializeCoding({ code: 42 })).toBe('42');
    });
});
