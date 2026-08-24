import { describe, expect, it } from 'vitest';
import { DCommaList } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

function text(input: string) {
    return input.replaceAll(/\s+/g, ' ').trim();
}

describe('DCommaList', () => {
    it('should join the items with a comma', () => {
        const { wrapper } = mountComponent(DCommaList, { items: ['A', 'B', 'C'] }, {});

        expect(text(wrapper.text())).toBe('A, B, C');
    });

    it('should render a single item without a separator', () => {
        const { wrapper } = mountComponent(DCommaList, { items: ['A'] }, {});

        expect(text(wrapper.text())).toBe('A');
    });

    it('should render nothing for an empty list', () => {
        const { wrapper } = mountComponent(DCommaList, { items: [] }, {});

        expect(text(wrapper.text())).toBe('');
    });
});
