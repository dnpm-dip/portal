import { describe, expect, it } from 'vitest';
import type {
    QuerySummaryDemographics,
    ResourceCollectionLoadMeta,
    ResourceCollectionResponse,
} from '@dnpm-dip/http-kit';
import type {
    PatientMatch,
    PatientRecord,
    QueryDiagnosisFilter,
    QueryHpoFilter,
    QuerySession,
    QuerySummaryDiagnostics,
} from '../../../src/runtime/domains';
import { createModuleClient } from '../../utils';

const querySession : QuerySession = {
    id: 'q-1',
    submittedAt: '2026-01-01T00:00:00Z',
    querier: 'querier-1',
    mode: { code: 'local' },
    criteria: { diagnoses: [] },
    expiresAfter: 3600,
    lastUpdate: '2026-01-01T00:00:00Z',
    peers: [],
};

const demographics : QuerySummaryDemographics = {
    siteDistribution: {
        total: 1,
        elements: [{ key: { code: 'site-a' }, value: { count: 1, percent: 100 } }],
    },
    genderDistribution: {
        total: 1,
        elements: [{ key: { code: 'male' }, value: { count: 1, percent: 100 } }],
    },
    ageDistribution: {
        total: 1,
        elements: [{ key: { min: 40, max: 49 }, value: { count: 1, percent: 100 } }],
    },
};

const diagnostics : QuerySummaryDiagnostics = {
    overallDistributions: {
        hpoTerms: {
            total: 1,
            elements: [{ key: { code: 'HP:0001250' }, value: { count: 1, percent: 100 } }],
        },
        diagnoses: {
            total: 1,
            elements: [{ key: { code: 'ORPHA:98896' }, value: { count: 1, percent: 100 } }],
        },
    },
    distributionsByVariant: [
        {
            key: { code: 'BRCA1' },
            value: {
                diagnoses: { total: 0, elements: [] },
                hpoTerms: { total: 0, elements: [] },
            },
        },
    ],
};

describe('rd QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({
            'POST /rd/queries': () => ({
                id: 'q-1',
                submittedAt: '2026-01-01T00:00:00Z',
                querier: 'querier-1',
                mode: { code: 'local' },
                criteria: { diagnoses: [] },
                expiresAfter: 3600,
                lastUpdate: '2026-01-01T00:00:00Z',
                peers: [],
            }),
        });

        await moduleClient.query.submit({} as any);

        expect(client.requests[0]?.body).toMatchObject({ mode: { code: 'local' } });
    });

    it('should keep an explicitly given request mode on submit', async () => {
        const { client, moduleClient } = createModuleClient({ 'POST /rd/queries': () => querySession });

        await moduleClient.query.submit({
            mode: { code: 'federated' },
            criteria: { diagnoses: [{ code: 'ORPHA:98896' }] },
        });

        expect(client.requests[0]?.method).toBe('POST');
        expect(client.requests[0]?.url).toContain('/rd/queries');
        expect(client.requests[0]?.body).toMatchObject({
            mode: { code: 'federated' },
            criteria: { diagnoses: [{ code: 'ORPHA:98896' }] },
        });
    });

    it('should read a single query session', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id': () => querySession });

        const response = await moduleClient.query.getOne('q-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1');
        expect(response.id).toBe('q-1');
    });

    it('should refresh a query session without a payload', async () => {
        const { client, moduleClient } = createModuleClient({ 'PUT /rd/queries/:id': () => querySession });

        await moduleClient.query.update('q-1');

        expect(client.requests[0]?.method).toBe('PUT');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1');
        expect(client.requests[0]?.body).toBeUndefined();
    });

    it('should send the criteria when refreshing a query session', async () => {
        const { client, moduleClient } = createModuleClient({ 'PUT /rd/queries/:id': () => querySession });

        await moduleClient.query.update('q-1', {
            mode: { code: 'federated' },
            criteria: { hpoTerms: [{ code: 'HP:0001250' }] },
        });

        expect(client.requests[0]?.body).toMatchObject({
            mode: { code: 'federated' },
            criteria: { hpoTerms: [{ code: 'HP:0001250' }] },
        });
    });

    it('should address the diagnosis filter endpoint', async () => {
        const filter : QueryDiagnosisFilter = { category: [{ code: 'ORPHA:98896', display: 'Ataxie' }] };

        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/filters/diagnosis': () => filter });

        const response = await moduleClient.query.getDiagnosisFilter('q-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/filters/diagnosis');
        expect(response.category).toHaveLength(1);
    });

    it('should address the hpo filter endpoint', async () => {
        const filter : QueryHpoFilter = { value: [{ code: 'HP:0001250', display: 'Seizure' }] };

        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/filters/hpo': () => filter });

        const response = await moduleClient.query.getHpoFilter('q-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/filters/hpo');
        expect(response.value).toHaveLength(1);
    });

    it('should address the patient-matches endpoint with pagination', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/patient-matches': () => ({ entries: [], size: 0 }) });

        await moduleClient.query.getPatients('q-1', { limit: 10, offset: 0 });

        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/patient-matches');
        expect(client.requests[0]?.url).toContain('limit=10');
    });

    it('should address the patient-matches endpoint with the full collection meta', async () => {
        const collection : ResourceCollectionResponse<PatientMatch> = {
            entries: [
                {
                    id: 'p-1',
                    gender: { code: 'male' },
                    age: { value: 42, unit: 'Years' },
                    vitalStatus: { code: 'alive' },
                    matchingCriteria: { diagnoses: [{ code: 'ORPHA:98896' }] },
                },
            ],
            size: 1,
        };
        const meta : ResourceCollectionLoadMeta = {
            limit: 25,
            offset: 50,
            sort: { age: 'desc' },
            filters: { 'diagnosis[category]': 'ORPHA:98896' },
        };

        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/patient-matches': () => collection });

        const response = await moduleClient.query.getPatients('q-1', meta);

        const url = client.requests[0]?.url ?? '';
        expect(url).toContain('limit=25');
        expect(url).toContain('offset=50');
        expect(url).toContain('sort=-age');
        expect(decodeURIComponent(url)).toContain('diagnosis[category]=ORPHA:98896');
        expect(response.entries).toHaveLength(1);
    });

    it('should omit the patient-matches query string without collection meta', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/patient-matches': () => ({ entries: [], size: 0 }) });

        await moduleClient.query.getPatients('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should omit the demographics query string without a url query record', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /rd/queries/:id/demographics': () => ({
                siteDistribution: { total: 0, elements: [] },
                genderDistribution: { total: 0, elements: [] },
                ageDistribution: { total: 0, elements: [] },
            }),
        });

        await moduleClient.query.getDemographics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should address the demographics endpoint and serialize the url query record', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/demographics': () => demographics });

        const response = await moduleClient.query.getDemographics('q-1', { 'diagnosis[category]': ['ORPHA:98896', 'ORPHA:773'] });

        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/demographics');
        expect(decodeURIComponent(client.requests[0]?.url ?? ''))
            .toContain('diagnosis[category]=ORPHA:98896&diagnosis[category]=ORPHA:773');
        expect(response.siteDistribution.total).toBe(1);
    });

    it('should address the diagnostics endpoint and serialize the url query record', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/diagnostics': () => diagnostics });

        const response = await moduleClient.query.getDiagnostics('q-1', { 'hpo[value]': 'HP:0001250' });

        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/diagnostics');
        expect(decodeURIComponent(client.requests[0]?.url ?? '')).toContain('hpo[value]=HP:0001250');
        expect(response.distributionsByVariant).toHaveLength(1);
    });

    it('should omit the diagnostics query string for an empty url query record', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:id/diagnostics': () => diagnostics });

        await moduleClient.query.getDiagnostics('q-1', {});

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should address the patient-record endpoint with both ids', async () => {
        const record : PatientRecord = {
            patient: {
                id: 'p-1',
                gender: { code: 'male' },
                birthDate: '1980-01-01',
            },
            episodesOfCare: [],
            diagnoses: [],
            gmfcsStatus: [],
            hospitalization: {
                numberOfStays: { code: 'none' },
                numberOfDays: { code: 'none' },
            },
            hpoTerms: [],
            ngsReports: [],
        };

        const { client, moduleClient } = createModuleClient({ 'GET /rd/queries/:queryId/patient-record/:patientId': () => record });

        const response = await moduleClient.query.getPatientRecord('q-1', 'p-1');

        expect(client.requests[0]?.url).toContain('/rd/queries/q-1/patient-record/p-1');
        expect(client.requests[0]?.params).toEqual({ queryId: 'q-1', patientId: 'p-1' });
        expect(response.patient.id).toBe('p-1');
    });
});
