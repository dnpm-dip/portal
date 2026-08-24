import { describe, expect, it } from 'vitest';
import type { ValidationReport, ValidationReportInfo } from '../../../src/domains';
import { ValidationAPI } from '../../../src/domains';
import { createFakeClient } from '../../../src/testing';

const reportInfo : ValidationReportInfo = {
    id: 'v-1',
    createdAt: '2024-01-01T10:00:00Z',
    issues: {
        warning: 1, 
        error: 2, 
        info: 0, 
    },
};

const report : ValidationReport = {
    patient: 'patient-1',
    createdAt: '2024-01-01T10:00:00Z',
    issues: [{
        severity: 'error', 
        message: 'Diagnose fehlt', 
        path: '/diagnoses/0', 
    }],
};

describe('ValidationAPI', () => {
    it('should read the report infos of the use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/infos': () => ({ entries: [reportInfo], size: 1 }) } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getReportInfo();

        expect(client.requests[0]?.url).toContain('/mtb/validation/infos');
        expect(response.entries[0]?.id).toBe('v-1');
        expect(response.entries[0]?.issues.error).toBe(2);
    });

    it('should read one report by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/report/:id': () => report } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getReport('report-1');

        expect(client.requests[0]?.url).toContain('/mtb/validation/report/report-1');
        expect(client.requests[0]?.params).toEqual({ id: 'report-1' });
        expect(response.issues[0]?.message).toBe('Diagnose fehlt');
        expect(response.patient).toBe('patient-1');
    });

    it('should scope the report route by use case', async () => {
        const client = createFakeClient({ handlers: { 'GET /rd/validation/report/:id': () => report } });
        const api = new ValidationAPI({ client, useCase: 'rd' });

        await api.getReport('report-1');

        expect(client.requests[0]?.url).toContain('/rd/validation/report/report-1');
    });

    it('should read one patient record by id', async () => {
        const client = createFakeClient({ handlers: { 'GET /mtb/validation/patient-record/:id': () => ({ patient: { id: 'patient-1', gender: { code: 'male' } } }) } });
        const api = new ValidationAPI({ client, useCase: 'mtb' });

        const response = await api.getPatientRecord('patient-1') as { patient: { id: string } };

        expect(client.requests[0]?.url).toContain('/mtb/validation/patient-record/patient-1');
        expect(client.requests[0]?.params).toEqual({ id: 'patient-1' });
        expect(response.patient.id).toBe('patient-1');
    });
});
