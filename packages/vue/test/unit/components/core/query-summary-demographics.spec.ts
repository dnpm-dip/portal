import installTable from '@vuecs/table';
import type { App } from 'vue';
import { describe, expect, it } from 'vitest';
import type { QuerySummaryDemographics } from '@dnpm-dip/http-kit';
import type { QueryFilterStore } from '../../../../src';
import { DQuerySummaryDemographics, QueryFilterURLKey, useQueryFilterStore } from '../../../../src';
import { mountComponent } from '../../../../src/testing';

const entity : QuerySummaryDemographics = {
    siteDistribution: {
        total: 3,
        elements: [
            { key: { code: 'site-a', display: 'Standort A' }, value: { count: 2, percent: 66.6 } },
            { key: { code: 'site-b', display: 'Standort B' }, value: { count: 1, percent: 33.4 } },
        ],
    },
    genderDistribution: {
        total: 3,
        elements: [
            { key: { code: 'female', display: 'Weiblich' }, value: { count: 2, percent: 66.6 } },
            { key: { code: 'male', display: 'Männlich' }, value: { count: 1, percent: 33.4 } },
        ],
    },
    ageDistribution: {
        total: 3,
        elements: [
            { key: { min: 20, max: 29 }, value: { count: 3, percent: 100 } },
        ],
    },
};

// The three distributions render as DKVTable (the switch defaults to the table
// variant), which resolves <VCTable> globally — the portal registers it in
// plugins/vuecs.ts, so the harness has to do the same for the click path to exist.
function mountSummary(props: Record<string, any> = {}) {
    let app : App | undefined;

    const mounted = mountComponent(DQuerySummaryDemographics, { entity, ...props }, {}, {
        onApp: (instance: App) => {
            app = instance;
            instance.use(installTable);
        },
    });

    const store : QueryFilterStore = useQueryFilterStore(mounted.pinia, app);

    return { ...mounted, store };
}

describe('DQuerySummaryDemographics', () => {
    it('should render a section per distribution', () => {
        const { wrapper } = mountSummary();

        const text = wrapper.text();

        expect(text).toContain('Patienten pro Standort');
        expect(text).toContain('Geschlechterverteilung');
        expect(text).toContain('Altersverteilung');
        expect(text).not.toContain('N = 3');
    });

    it('should append the totals when withTotals is set', () => {
        const { wrapper } = mountSummary({ withTotals: true });

        expect(wrapper.text()).toContain('Patienten pro Standort (N = 3)');
        expect(wrapper.text()).toContain('Geschlechterverteilung (N = 3)');
        expect(wrapper.text()).toContain('Altersverteilung (N = 3)');
    });

    it('should render the distribution entries', () => {
        const { wrapper } = mountSummary();

        const text = wrapper.text();

        expect(text).toContain('Standort A');
        expect(text).toContain('Weiblich');
        expect(text).toContain('20-29');
    });

    it('should filter by site and ask for navigation when a site is clicked', async () => {
        const { wrapper, store } = mountSummary();

        await wrapper.findAll('a')[0]?.trigger('click');

        expect(store.getItems(QueryFilterURLKey.SITE)).toEqual([{ code: 'site-a', display: 'Standort A' }]);
        expect(store.active).toBe('patient');
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });

    it('should clear the site filter without navigating when the active site is clicked again', async () => {
        const { wrapper, store } = mountSummary();

        await wrapper.findAll('a')[0]?.trigger('click');
        await wrapper.findAll('a')[0]?.trigger('click');

        expect(store.getItems(QueryFilterURLKey.SITE)).toEqual([]);
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });

    it('should filter by gender when a gender is clicked', async () => {
        const { wrapper, store } = mountSummary();

        await wrapper.findAll('a')[3]?.trigger('click');

        expect(store.getItems(QueryFilterURLKey.GENDER)).toEqual([{ code: 'male', display: 'Männlich' }]);
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });

    it('should filter by the age range bounds when an age bucket is clicked', async () => {
        const { wrapper, store } = mountSummary();

        await wrapper.findAll('a')[4]?.trigger('click');

        expect(store.getItems(QueryFilterURLKey.AGE_MIN)).toEqual([{ code: 20 }]);
        expect(store.getItems(QueryFilterURLKey.AGE_MAX)).toEqual([{ code: 29 }]);
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });

    it('should clear both age bounds without navigating when the active bucket is clicked again', async () => {
        const { wrapper, store } = mountSummary();

        await wrapper.findAll('a')[4]?.trigger('click');
        await wrapper.findAll('a')[4]?.trigger('click');

        expect(store.getItems(QueryFilterURLKey.AGE_MIN)).toEqual([]);
        expect(store.getItems(QueryFilterURLKey.AGE_MAX)).toEqual([]);
        expect(wrapper.emitted('navigate')).toHaveLength(1);
    });
});
