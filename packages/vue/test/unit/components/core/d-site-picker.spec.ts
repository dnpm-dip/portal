import { VCFormSelectSearch } from '@vuecs/forms';
import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { SiteResponse } from '@dnpm-dip/http-kit';
import { DSitePicker } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const sites : SiteResponse = {
    local: { code: 'site-a', display: 'Standort A' },
    others: [
        { code: 'site-b', display: 'Standort B' },
        { code: 'site-c' },
    ],
};

function mountPicker(props: Record<string, any> = {}) {
    return mountComponent(DSitePicker, { useCase: 'mtb', ...props }, { 'GET /mtb/sites': () => sites });
}

describe('DSitePicker', () => {
    it('should request the sites of the given use case', async () => {
        const { client } = mountPicker();

        await flushPromises();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/sites');
    });

    it('should request the sites of another use case', async () => {
        const { client } = mountComponent(DSitePicker, { useCase: 'rd' }, { 'GET /rd/sites': () => sites });

        await flushPromises();

        expect(client.requests[0]?.url).toContain('/rd/sites');
    });

    it('should offer the local site first, followed by the peers', async () => {
        const { wrapper } = mountPicker();

        await flushPromises();

        expect(wrapper.findComponent(VCFormSelectSearch).props('options')).toEqual([
            { value: 'site-a', label: 'Standort A' },
            { value: 'site-b', label: 'Standort B' },
            { value: 'site-c', label: 'site-c' },
        ]);
    });

    it('should preselect the codes of the modelValue', async () => {
        const { wrapper } = mountPicker({ modelValue: [{ code: 'site-b' }] });

        await flushPromises();

        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toEqual(['site-b']);
    });

    it('should emit codings for the selected values', async () => {
        const { wrapper } = mountPicker();

        await flushPromises();

        wrapper.findComponent(VCFormSelectSearch).vm.$emit('change', ['site-b', 'site-c']);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[
            { code: 'site-b', display: 'Standort B' },
            { code: 'site-c', display: 'site-c' },
        ]]);
    });

    it('should emit an empty selection when the value is cleared', async () => {
        const { wrapper } = mountPicker();

        await flushPromises();

        wrapper.findComponent(VCFormSelectSearch).vm.$emit('change', null);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);
    });
});
