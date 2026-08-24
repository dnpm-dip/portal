import installTable from '@vuecs/table';
import type { App } from 'vue';
import { describe, expect, it } from 'vitest';
import type { ConceptsCount, KeyValueRecord } from '@dnpm-dip/http-kit';
import { DKVTable, DKVTableEntryKey } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const genderDistribution : ConceptsCount = [
    { key: { code: 'female', display: 'Weiblich' }, value: { count: 2, percent: 66.6 } },
    { key: { code: 'male', display: 'Männlich' }, value: { count: 1, percent: 33.4 } },
];

// The portal registers the VCTable family globally (plugins/vuecs.ts); DKVTable
// resolves <VCTable> by name rather than importing it, so the harness needs it too.
function mountTable(props: Record<string, any>) {
    return mountComponent(DKVTable, props, {}, {
        onApp: (app: App) => {
            app.use(installTable);
        },
    });
}

describe('DKVTable', () => {
    it('should render one row per concept count with its label, count and percent', () => {
        const { wrapper } = mountTable({ data: genderDistribution });

        const text = wrapper.text();

        expect(text).toContain('Weiblich');
        expect(text).toContain('2.00');
        expect(text).toContain('66.6%');
        expect(text).toContain('Männlich');
        expect(text).toContain('33.4%');
    });

    it('should render the default column labels', () => {
        const { wrapper } = mountTable({ data: genderDistribution });

        const headers = wrapper.findAll('th').map((el) => el.text());

        expect(headers).toEqual(['Element', 'Häufigkeit', 'Prozent (%)']);
    });

    it('should honour custom column labels', () => {
        const { wrapper } = mountTable({
            data: genderDistribution,
            keyLabel: 'Geschlecht',
            valueLabel: 'Anzahl [n]',
            percentLabel: 'Anteil [%]',
        });

        expect(wrapper.findAll('th').map((el) => el.text())).toEqual(['Geschlecht', 'Anzahl [n]', 'Anteil [%]']);
    });

    it('should drop hidden columns', () => {
        const { wrapper } = mountTable({
            data: genderDistribution,
            percentHidden: true,
            valueHidden: true,
        });

        expect(wrapper.findAll('th').map((el) => el.text())).toEqual(['Element']);
    });

    it('should build the columns from the columns function', () => {
        const { wrapper } = mountTable({
            data: genderDistribution,
            columns: () => [{ key: 'key', label: 'Nur Element' }, { key: 'value' }],
        });

        expect(wrapper.findAll('th').map((el) => el.text())).toEqual(['Nur Element', 'Häufigkeit']);
    });

    it('should not render key links when it is not clickable', () => {
        const { wrapper } = mountTable({ data: genderDistribution });

        expect(wrapper.findAll('a')).toHaveLength(0);
    });

    it('should emit the original coding when a clickable key is clicked', async () => {
        const { wrapper } = mountTable({ data: genderDistribution, clickable: true });

        await wrapper.findAll('a')[1]?.trigger('click');

        expect(wrapper.emitted('clicked')?.[0]).toEqual([[{ code: 'male', display: 'Männlich' }]]);
    });

    it('should emit a coding built from a plain string key', async () => {
        const data : KeyValueRecord<unknown, unknown>[] = [
            { key: 'unbekannt', value: { count: 3, percent: 100 } },
        ];

        const { wrapper } = mountTable({ data, clickable: true });

        expect(wrapper.text()).toContain('unbekannt');

        await wrapper.find('a').trigger('click');

        expect(wrapper.emitted('clicked')?.[0]).toEqual([[{ code: 'unbekannt' }]]);
    });

    it('should emit the range bounds for a min/max key', async () => {
        const data : KeyValueRecord<unknown, unknown>[] = [
            { key: { min: 20, max: 29 }, value: { count: 4, percent: 100 } },
        ];

        const { wrapper } = mountTable({ data, clickable: true });

        expect(wrapper.text()).toContain('20-29');

        await wrapper.find('a').trigger('click');

        expect(wrapper.emitted('clicked')?.[0]).toEqual([[{ code: 20 }, { code: 29 }]]);
    });

    it('should render the verbose coding label when asked for', () => {
        const { wrapper } = mountTable({ data: genderDistribution, codingVerboseLabel: true });

        expect(wrapper.text()).toContain('female: Weiblich');
    });

    it('should reveal the children of an expandable row on toggle', async () => {
        const data : KeyValueRecord<unknown, unknown>[] = [
            {
                key: { code: 'C50', display: 'Mamma' },
                value: { count: 5, percent: 100 },
                children: [
                    { key: { code: 'C50.1', display: 'Mamma zentral' }, value: { count: 5, percent: 100 } },
                ],
            },
        ];

        const { wrapper } = mountTable({ data });

        expect(wrapper.text()).not.toContain('Mamma zentral');

        await wrapper.find('button').trigger('click');

        expect(wrapper.text()).toContain('Mamma zentral');
    });
});

describe('DKVTableEntryKey', () => {
    it('should render the display of a coding key', () => {
        const { wrapper } = mountComponent(DKVTableEntryKey, { entity: { key: { code: 'female', display: 'Weiblich' }, value: 2 } }, {});

        expect(wrapper.text()).toBe('Weiblich');
    });

    it('should render the bounds of a range key', () => {
        const { wrapper } = mountComponent(DKVTableEntryKey, { entity: { key: { min: 20, max: 29 }, value: 3 } }, {});

        expect(wrapper.text()).toBe('20-29');
    });

    it('should join the labels of a composite key', () => {
        const { wrapper } = mountComponent(DKVTableEntryKey, { entity: { key: [{ code: 'a', display: 'A' }, 'b'], value: 1 } }, {});

        expect(wrapper.text()).toBe('A, b');
    });

    it('should fall back to Unknown for an unlabelable key', () => {
        const { wrapper } = mountComponent(DKVTableEntryKey, { entity: { key: 42, value: 1 } }, {});

        expect(wrapper.text()).toBe('Unknown');
    });
});
