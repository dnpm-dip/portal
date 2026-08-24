import { fakeResponse } from '@dnpm-dip/http-kit/testing';
import type { ErrorSlotProps, ResourceRecordDefaultSlotProps } from '@dnpm-dip/vue';
import { flushPromises } from '@vue/test-utils';
import { Suspense, defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import AConnectionReport from '../../../src/runtime/components/AConnectionReport';
import type { ConnectionReport } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

const report : ConnectionReport = {
    peers: [
        {
            site: { code: 'site-a' },
            status: 'online',
            details: 'ok',
        },
        {
            site: { code: 'site-b' },
            status: 'offline',
            details: 'unreachable',
        },
    ],
    self: {
        site: { code: 'site-self' },
        status: 'online',
        details: 'ok',
    },
    createdAt: '2026-01-01T00:00:00Z',
};

const Host = defineComponent({
    props: { lazyLoad: { type: Boolean } },
    setup(props) {
        return () => h('div', { class: 'host' }, [
            h(Suspense, null, {
                default: () => h(AConnectionReport, { lazyLoad: props.lazyLoad }, {
                    default: ({ data, load }: ResourceRecordDefaultSlotProps<ConnectionReport>) => h(
                        'div',
                        { class: 'report' },
                        [
                            h('span', { class: 'self' }, data.self.site.code),
                            ...data.peers.map((peer) => h(
                                'span',
                                { class: 'peer' },
                                `${peer.site.code}:${peer.status}`,
                            )),
                            h('button', { class: 'reload', onClick: () => load() }),
                            h('button', { class: 'reset', onClick: () => load(true) }),
                        ],
                    ),
                    loading: () => h('div', { class: 'loading' }),
                    error: ({ data }: ErrorSlotProps) => h('div', { class: 'error' }, data.message),
                }),
                fallback: () => h('div', { class: 'suspended' }),
            }),
        ]);
    },
});

describe('AConnectionReport', () => {
    it('should request the report and hand the record to the default slot', async () => {
        const { wrapper, client } = mountModuleComponent(Host, {}, { 'GET /admin/connection-report': () => report });

        await flushPromises();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/admin/connection-report');
        expect(client.requests[0]?.body).toBeUndefined();

        expect(wrapper.find('.self').text()).toBe('site-self');
        expect(wrapper.findAll('.peer').map((el) => el.text())).toEqual([
            'site-a:online',
            'site-b:offline',
        ]);
        expect(wrapper.find('.loading').exists()).toBe(false);
    });

    it('should render the default slot for a report without peers', async () => {
        const { wrapper } = mountModuleComponent(Host, {}, { 'GET /admin/connection-report': () => ({ ...report, peers: [] }) });

        await flushPromises();

        expect(wrapper.find('.report').exists()).toBe(true);
        expect(wrapper.find('.self').text()).toBe('site-self');
        expect(wrapper.findAll('.peer')).toHaveLength(0);
    });

    it('should re-request the report only when the slot reload asks for a reset', async () => {
        const { wrapper, client } = mountModuleComponent(Host, {}, { 'GET /admin/connection-report': () => report });

        await flushPromises();

        expect(client.requests).toHaveLength(1);

        await wrapper.find('.reload').trigger('click');
        await flushPromises();

        expect(client.requests).toHaveLength(1);

        await wrapper.find('.reset').trigger('click');
        await flushPromises();

        expect(client.requests).toHaveLength(2);
        expect(wrapper.find('.self').text()).toBe('site-self');
    });

    it('should render the error slot with the issue details when the request fails', async () => {
        const { wrapper } = mountModuleComponent(Host, {}, { 'GET /admin/connection-report': () => fakeResponse(500, { issues: [{ severity: 'error', details: 'peer registry unreachable' }] }) });

        await flushPromises();

        expect(wrapper.find('.report').exists()).toBe(false);
        expect(wrapper.find('.error').text()).toBe('peer registry unreachable');
    });

    it('should suspend until the report resolved', async () => {
        const deferred = Promise.withResolvers<ConnectionReport>();

        const { wrapper } = mountModuleComponent(Host, {}, { 'GET /admin/connection-report': () => deferred.promise });

        await flushPromises();

        expect(wrapper.find('.suspended').exists()).toBe(true);
        expect(wrapper.find('.loading').exists()).toBe(false);

        deferred.resolve(report);
        await flushPromises();

        expect(wrapper.find('.suspended').exists()).toBe(false);
        expect(wrapper.find('.report').exists()).toBe(true);
    });

    it('should resolve the boundary before the report when loading lazily', async () => {
        const deferred = Promise.withResolvers<ConnectionReport>();

        const { wrapper, client } = mountModuleComponent(Host, { lazyLoad: true }, { 'GET /admin/connection-report': () => deferred.promise });

        await flushPromises();

        expect(wrapper.find('.suspended').exists()).toBe(false);
        expect(wrapper.find('.loading').exists()).toBe(true);
        expect(wrapper.find('.report').exists()).toBe(false);

        deferred.resolve(report);
        await flushPromises();

        expect(wrapper.find('.report').exists()).toBe(true);
        expect(client.requests).toHaveLength(1);
    });
});
