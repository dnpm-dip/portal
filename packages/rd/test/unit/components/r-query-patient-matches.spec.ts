import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import type { ResourceCollectionResponse } from '@dnpm-dip/http-kit';
import type { ObjectLiteral } from '@dnpm-dip/kit';
import RQueryPatientMatches from '../../../src/runtime/components/core/RQueryPatientMatches';
import type { PatientMatch } from '../../../src/runtime/domains';
import { mountModuleComponent } from '../../utils';

function createPatientMatch(id: string) : PatientMatch {
    return {
        id,
        gender: { code: 'male' },
        age: { value: 42, unit: 'Years' },
        vitalStatus: { code: 'alive' },
        matchingCriteria: { diagnoses: [{ code: 'ORPHA:98896' }] },
    };
}

/**
 * `size` deliberately differs from the number of entries: the component maps
 * the collection response onto the manager's `{ data, total }` shape, and a
 * total derived from `entries.length` would pass an equal-sized fixture.
 */
const collection : ResourceCollectionResponse<PatientMatch> = {
    entries: [createPatientMatch('p-1'), createPatientMatch('p-2')],
    size: 42,
};

type SlotLoad = (meta: { limit?: number, offset?: number }) => Promise<void>;

let slotLoad : SlotLoad | undefined;

const Host = defineComponent({
    props: {
        filters: {
            type: Object as PropType<ObjectLiteral>,
            default: undefined,
        },
    },
    setup(props) {
        return () => h(
            RQueryPatientMatches,
            { queryId: 'q-1', filters: props.filters },
            {
                default: ({
                    data, 
                    total, 
                    load, 
                }: {
                    data: PatientMatch[], 
                    total: number, 
                    load: SlotLoad 
                }) => {
                    slotLoad = load;

                    return h('div', `${total}|${data.map((el) => el.id).join(',')}`);
                },
            },
        );
    },
});

async function mountMatches(
    props: Record<string, any> = {},
    handler = () => collection,
) {
    slotLoad = undefined;

    const mounted = mountModuleComponent(Host, props, { 'GET /rd/queries/:id/patient-matches': handler });

    await flushPromises();

    return mounted;
}

describe('RQueryPatientMatches', () => {
    it('should load the patient matches of the given query', async () => {
        const { client } = await mountMatches();

        expect(client.requests).toHaveLength(1);
        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/patient-matches');
    });

    it('should request the first page with the default page size', async () => {
        const { client } = await mountMatches();

        const url = client.requests[0]?.url ?? '';

        expect(url).toContain('limit=20');
        expect(url).toContain('offset=0');
    });

    it('should carry the given filters into the request', async () => {
        const { client } = await mountMatches({ filters: { 'diagnosis[category]': 'ORPHA:98896' } });

        expect(decodeURIComponent(client.requests[0]?.url ?? '')).toContain('diagnosis[category]=ORPHA:98896');
    });

    it('should hand the entries and the collection size to the default slot', async () => {
        const { wrapper } = await mountMatches();

        expect(wrapper.text()).toBe('42|p-1,p-2');
    });

    it('should reload with the page the slot asks for', async () => {
        const { client } = await mountMatches();

        await slotLoad?.({ limit: 10, offset: 10 });
        await flushPromises();

        expect(client.requests).toHaveLength(2);
        expect(client.requests[1]?.url).toContain('limit=10');
        expect(client.requests[1]?.url).toContain('offset=10');
    });
});
