import { describe, expect, it } from 'vitest';
import type { PreparedQuery, ResourceCollectionResponse } from '@dnpm-dip/http-kit';
import type { QueryCriteria } from '../../../src/runtime/domains';
import { createModuleClient } from '../../utils';

const criteria : QueryCriteria = { diagnoses: [{ code: 'ORPHA:98896' }] };

const preparedQuery : PreparedQuery<QueryCriteria> = {
    id: 'pq-1',
    name: 'Ataxie',
    criteria,
};

const collection : ResourceCollectionResponse<PreparedQuery<QueryCriteria>> = {
    entries: [preparedQuery],
    size: 1,
};

describe('rd PreparedQueryAPI', () => {
    it('should read the prepared queries below the rd use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/prepared-queries': () => collection });

        const response = await moduleClient.preparedQuery.getMany();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/prepared-queries');
        expect(response.entries).toHaveLength(1);
    });

    it('should read a single prepared query below the rd use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/prepared-queries/:id': () => preparedQuery });

        const response = await moduleClient.preparedQuery.getOne('pq-1');

        expect(client.requests[0]?.url).toContain('/rd/prepared-queries/pq-1');
        expect(client.requests[0]?.params).toEqual({ id: 'pq-1' });
        expect(response.id).toBe('pq-1');
    });

    it('should keep an explicitly given name on create', async () => {
        const { client, moduleClient } = createModuleClient({ 'POST /rd/prepared-queries': () => preparedQuery });

        await moduleClient.preparedQuery.create({ name: 'Ataxie', criteria });

        expect(client.requests[0]?.method).toBe('POST');
        expect(client.requests[0]?.url).toContain('/rd/prepared-queries');
        expect(client.requests[0]?.body).toMatchObject({ name: 'Ataxie', criteria });
    });

    it('should name a prepared query created without one after its creation time', async () => {
        const { client, moduleClient } = createModuleClient({ 'POST /rd/prepared-queries': () => preparedQuery });

        await moduleClient.preparedQuery.create({ criteria });

        const body = client.requests[0]?.body as { name?: string, criteria?: QueryCriteria };

        expect(body.criteria).toEqual(criteria);
        expect(body.name).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should patch a prepared query below the rd use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'PATCH /rd/prepared-queries/:id': () => preparedQuery });

        await moduleClient.preparedQuery.update('pq-1', { name: 'Ataxie', criteria });

        expect(client.requests[0]?.method).toBe('PATCH');
        expect(client.requests[0]?.url).toContain('/rd/prepared-queries/pq-1');
        expect(client.requests[0]?.body).toMatchObject({ name: 'Ataxie', criteria });
    });

    it('should delete a prepared query below the rd use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'DELETE /rd/prepared-queries/:id': () => preparedQuery });

        await moduleClient.preparedQuery.delete('pq-1');

        expect(client.requests[0]?.method).toBe('DELETE');
        expect(client.requests[0]?.url).toContain('/rd/prepared-queries/pq-1');
    });
});
