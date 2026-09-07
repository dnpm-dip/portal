import { describe, expect, it } from 'vitest';
import type { Coding } from '@dnpm-dip/http-kit';
import { DCodingCommaList, transformCodingsToFormSelectOptions } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const codings : Coding[] = [
    { code: 'C50.9', display: 'Mamma, n.n.bez.' },
    { code: 'C34.1' },
];

function text(input: string) {
    return input.replaceAll(/\s+/g, ' ').trim();
}

describe('DCodingCommaList', () => {
    it('should prefer the display over the code and join with a comma', () => {
        const { wrapper } = mountComponent(DCodingCommaList, { items: codings }, {});

        expect(text(wrapper.text())).toBe('Mamma, n.n.bez., C34.1');
    });

    it('should render nothing for an empty list', () => {
        const { wrapper } = mountComponent(DCodingCommaList, { items: [] }, {});

        expect(text(wrapper.text())).toBe('');
    });
});

describe('transformCodingsToFormSelectOptions', () => {
    it('should map the display to the label and the code to the value', () => {
        expect(transformCodingsToFormSelectOptions(codings)).toEqual([
            { value: 'C50.9', label: 'Mamma, n.n.bez.' },
            { value: 'C34.1', label: 'C34.1' },
        ]);
    });

    it('should map an empty list to an empty option list', () => {
        expect(transformCodingsToFormSelectOptions([])).toEqual([]);
    });
});
