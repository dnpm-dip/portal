import { describe, expect, it } from 'vitest';
import { ValidationAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

describe('ValidationAPI', () => {
    it('should read the report infos of the use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/infos': () => ({ entries: [{ id: 'v-1' }], size: 1 }) } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getReportInfo();

        expect(client.requests[0]?.url).toContain('/mtb/validation/infos');
        expect(response.entries[0]?.id).toBe('v-1');
    });

    it('should read one report by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/report/:id': (request) => ({ patient: request.params.id }) } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getReport('report-1');

        expect(client.requests[0]?.url).toContain('/mtb/validation/report/report-1');
        expect(response.patient).toBe('report-1');
    });

    it('should scope the report route by use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /rd/validation/report/:id': () => ({ patient: 'p-1' }) } });
        const api = new ValidationAPI({ client, useCase: 'rd' });

        await api.getReport('report-1');

        expect(client.requests[0]?.url).toContain('/rd/validation/report/report-1');
    });

    it('should read one patient record by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/patient-record/:id': (request) => ({ id: request.params.id }) } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getPatientRecord('patient-1') as { id: string };

        expect(client.requests[0]?.url).toContain('/mtb/validation/patient-record/patient-1');
        expect(response.id).toBe('patient-1');
    });
});
