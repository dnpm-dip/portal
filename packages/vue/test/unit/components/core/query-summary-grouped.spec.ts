import { VCFormSelectSearch } from '@vuecs/forms';
import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { DQuerySummaryGrouped } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const items = [
    { key: { code: 'PTEN' }, value: 2 },
    { key: { code: 'BRAF' }, value: 3 },
];

describe('DQuerySummaryGrouped', () => {
    it('should preserve the selected key when refreshed items are reordered', async () => {
        const { wrapper } = mountComponent(DQuerySummaryGrouped, { items, selectFirst: true });
        await wrapper.setProps({
            items: [
                { key: { code: 'BRAF' }, value: 4 },
                { key: { code: 'PTEN' }, value: 5 },
            ], 
        });
        await flushPromises();

        expect(wrapper.vm.item).toEqual({ key: { code: 'PTEN' }, value: 5 });
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBe(1);
        wrapper.unmount();
    });

    it('should fall back to the first item when the selected key disappears', async () => {
        const { wrapper } = mountComponent(DQuerySummaryGrouped, { items, selectFirst: true });
        wrapper.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();

        await wrapper.setProps({ items: [items[0]] });
        await flushPromises();
        expect(wrapper.vm.item).toEqual(items[0]);
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBe(0);
        wrapper.unmount();
    });

    it('should clear both selection and content on reset without selectFirst', async () => {
        const { wrapper } = mountComponent(DQuerySummaryGrouped, { items });
        wrapper.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();
        expect(wrapper.vm.item).toEqual(items[1]);

        wrapper.vm.reset();
        await flushPromises();
        expect(wrapper.vm.item).toBeNull();
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    it('should clear a removed selection without selectFirst', async () => {
        const { wrapper } = mountComponent(DQuerySummaryGrouped, { items });
        wrapper.findComponent(VCFormSelectSearch).vm.$emit('update:modelValue', 1);
        await flushPromises();

        await wrapper.setProps({ items: [items[0]] });
        await flushPromises();
        expect(wrapper.vm.item).toBeNull();
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    it('should clear empty lists and select the first item when results return', async () => {
        const { wrapper } = mountComponent(DQuerySummaryGrouped, { items, selectFirst: true });
        await wrapper.setProps({ items: [] });
        wrapper.vm.reset();
        await flushPromises();
        expect(wrapper.vm.item).toBeNull();
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBeUndefined();

        await wrapper.setProps({ items });
        await flushPromises();
        expect(wrapper.vm.item).toEqual(items[0]);
        expect(wrapper.findComponent(VCFormSelectSearch).props('modelValue')).toBe(0);
        wrapper.unmount();
    });
});
