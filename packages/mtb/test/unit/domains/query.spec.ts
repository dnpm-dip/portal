import { describe, expect, it } from 'vitest';
import type {
    QuerySummaryDemographics,
    ResourceCollectionLoadMeta,
    ResourceCollectionResponse,
} from '@dnpm-dip/http-kit';
import type { KMSurvivalReport } from '@dnpm-dip/vue';
import type {
    PatientRecord,
    QueryCoarseTherapyResponse,
    QueryDiagnosisFilter,
    QueryGeneAlterationCriteria,
    QueryGeneAlterationInfo,
    QuerySession,
    QuerySummaryGeneAlterationDistribution,
    QuerySummaryMedication,
    QuerySummaryTumorDiagnostics,
    QueryTherapyImplementedFilter,
    QueryTherapyRecommendedFilter,
    QueryTherapyResponse,
} from '../../../src/runtime/domains';
import { buildQueryGeneAlterationCriteriaLabel } from '../../../src/runtime/domains';
import { createModuleClient } from '../../utils';

const querySession : QuerySession = {
    id: 'q-1',
    submittedAt: '2026-01-01T00:00:00Z',
    querier: 'querier-1',
    mode: { code: 'local' },
    criteria: {},
    expiresAfter: 3600,
    lastUpdate: '2026-01-01T00:00:00Z',
    peers: [],
};

const collectionMeta : ResourceCollectionLoadMeta = {
    limit: 25,
    offset: 50,
    sort: { count: 'desc' },
    filters: { 'diagnosis[code]': 'C25' },
};

function expectCollectionMeta(url: string) {
    expect(url).toContain('limit=25');
    expect(url).toContain('offset=50');
    expect(url).toContain('sort=-count');
    expect(decodeURIComponent(url)).toContain('diagnosis[code]=C25');
}

describe('mtb QueryAPI', () => {
    it('should default the request mode to local on submit', async () => {
        const { client, moduleClient } = createModuleClient({ 'POST /mtb/queries': () => querySession });

        await moduleClient.query.submit({} as any);

        expect(client.requests[0]?.body).toMatchObject({ mode: { code: 'local' } });
    });

    it('should address the patient-matches endpoint with pagination', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/patient-matches': () => ({ entries: [], size: 0 }) });

        await moduleClient.query.getPatients('q-1', { limit: 10, offset: 0 });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/patient-matches');
        expect(client.requests[0]?.url).toContain('limit=10');
    });

    it('should append the survival-statistics query string only when given', async () => {
        const { client, moduleClient } = createModuleClient({
            'GET /mtb/queries/:id/survival-statistics': () => ({
                data: [],
                grouping: { code: 'none' },
                survivalType: { code: 'overall' },
            }),
        });

        await moduleClient.query.getKaplanMeierStatistics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should append type and grouping to the survival-statistics query string', async () => {
        const report : KMSurvivalReport = {
            data: [],
            grouping: { code: 'by-therapy' },
            survivalType: { code: 'os' },
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/survival-statistics': () => report });

        await moduleClient.query.getKaplanMeierStatistics('q-1', 'os', 'by-therapy');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/survival-statistics?type=os&grouping=by-therapy');
    });

    it('should read a single query session', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id': () => querySession });

        await moduleClient.query.getOne('q-1');

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1');
    });

    it('should refresh a query session without a payload', async () => {
        const { client, moduleClient } = createModuleClient({ 'PUT /mtb/queries/:id': () => querySession });

        await moduleClient.query.update('q-1');

        expect(client.requests[0]?.method).toBe('PUT');
        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1');
        expect(client.requests[0]?.body).toBeUndefined();
    });

    it('should send the criteria when refreshing a query session', async () => {
        const { client, moduleClient } = createModuleClient({ 'PUT /mtb/queries/:id': () => querySession });

        await moduleClient.query.update('q-1', {
            mode: { code: 'federated' },
            criteria: { tumorEntities: [{ code: 'C25' }] },
        });

        expect(client.requests[0]?.body).toMatchObject({
            mode: { code: 'federated' },
            criteria: { tumorEntities: [{ code: 'C25' }] },
        });
    });

    it('should address the diagnosis filter endpoint', async () => {
        const filter : QueryDiagnosisFilter = { code: [{ code: 'C25', display: 'Pankreas' }] };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/filters/diagnosis': () => filter });

        await moduleClient.query.getDiagnosisFilter('q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/diagnosis');
    });

    it('should address the implemented therapy filter endpoint', async () => {
        const filter : QueryTherapyImplementedFilter = { medication: [[{ code: 'L01EC02' }]] };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/filters/therapy': () => filter });

        await moduleClient.query.getTherapyImplementedFilter('q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/therapy');
    });

    it('should address the recommended therapy filter endpoint', async () => {
        const filter : QueryTherapyRecommendedFilter = { medication: [[{ code: 'L01EC02' }]] };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/filters/therapy-recommendation': () => filter });

        await moduleClient.query.getTherapyRecommendedFilter('q-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/filters/therapy-recommendation');
    });

    it('should address the patient-record endpoint with both ids', async () => {
        const record : PatientRecord = {
            patient: {
                id: 'p-1',
                gender: { code: 'male' },
                birthDate: '1980-01-01',
            },
            episodesOfCare: [],
            guidelineTherapies: [],
            guidelineProcedures: [],
            performanceStatus: [],
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:queryId/patient-record/:patientId': () => record });

        await moduleClient.query.getPatientRecord('q-1', 'p-1');

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/patient-record/p-1');
        expect(client.requests[0]?.params).toEqual({ queryId: 'q-1', patientId: 'p-1' });
    });

    it('should address the therapy-responses endpoint with collection meta', async () => {
        const collection : ResourceCollectionResponse<QueryTherapyResponse> = {
            entries: [
                {
                    tumorEntity: { code: 'C25' },
                    medications: [{ code: 'L01EC02' }],
                    supportingAlteration: {
                        gene: { code: 'BRAF' },
                        type: 'SNV',
                        proteinChange: 'V600E',
                    },
                    count: 3,
                    responseDistribution: {
                        total: 3,
                        elements: [{ key: { code: 'PR' }, value: { count: 2, percent: 66 } }],
                    },
                },
            ],
            size: 1,
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/therapy-responses': () => collection });

        await moduleClient.query.getTherapyResponses('q-1', collectionMeta);

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/therapy-responses');
        expectCollectionMeta(client.requests[0]?.url ?? '');
    });

    it('should address the coarse-therapy-responses endpoint with collection meta', async () => {
        const collection : ResourceCollectionResponse<QueryCoarseTherapyResponse> = {
            entries: [
                {
                    tumorEntity: { code: 'C25' },
                    medications: [{ code: 'L01EC02' }],
                    supportingAlterations: [{ gene: { code: 'BRAF' }, type: 'SNV' }],
                    count: 3,
                    countResponderPFSRatio: 0.5,
                    responseDistribution: {
                        total: 3,
                        elements: [{ key: { code: 'PR' }, value: { count: 2, percent: 66 } }],
                    },
                },
            ],
            size: 1,
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/coarse-therapy-responses': () => collection });

        await moduleClient.query.getCoarseTherapyResponses('q-1', collectionMeta);

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/coarse-therapy-responses');
        expectCollectionMeta(client.requests[0]?.url ?? '');
    });

    it('should address the gene-alterations endpoint with collection meta', async () => {
        const collection : ResourceCollectionResponse<QueryGeneAlterationInfo> = {
            entries: [
                {
                    tumorEntity: { code: 'C25' },
                    alteration: { gene: { code: 'BRAF' }, type: 'SNV' },
                    gene: { code: 'BRAF' },
                    count: 2,
                    supporting: true,
                },
            ],
            size: 1,
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/gene-alterations': () => collection });

        await moduleClient.query.getGeneAlterationInfos('q-1', collectionMeta);

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/gene-alterations');
        expectCollectionMeta(client.requests[0]?.url ?? '');
    });

    it('should address the altered-gene-distributions endpoint with collection meta', async () => {
        const collection : ResourceCollectionResponse<QuerySummaryGeneAlterationDistribution> = {
            entries: [
                {
                    key: 'BRAF',
                    value: {
                        total: 4,
                        elements: [{ key: 'SNV', value: { count: 4, percent: 100 } }],
                    },
                },
            ],
            size: 1,
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/altered-gene-distributions': () => collection });

        await moduleClient.query.getGeneAlterationDistributions('q-1', collectionMeta);

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/altered-gene-distributions');
        expectCollectionMeta(client.requests[0]?.url ?? '');
    });

    it('should address the tumor-diagnostics endpoint and serialize the url query record', async () => {
        const summary : QuerySummaryTumorDiagnostics = {
            overallDistributions: {
                tumorEntities: {
                    total: 1,
                    elements: [{ key: { code: 'C25' }, value: { count: 1, percent: 100 } }],
                },
                tumorMorphologies: { total: 0, elements: [] },
            },
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/tumor-diagnostics': () => summary });

        await moduleClient.query.getTumorDiagnostics('q-1', { diagnosis: { code: 'C25' } });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/tumor-diagnostics');
        expect(decodeURIComponent(client.requests[0]?.url ?? '')).toContain('diagnosis[code]=C25');
    });

    it('should omit the tumor-diagnostics query string without a url query record', async () => {
        const summary : QuerySummaryTumorDiagnostics = {
            overallDistributions: {
                tumorEntities: { total: 0, elements: [] },
                tumorMorphologies: { total: 0, elements: [] },
            },
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/tumor-diagnostics': () => summary });

        await moduleClient.query.getTumorDiagnostics('q-1');

        expect(client.requests[0]?.url).not.toContain('?');
    });

    it('should address the medication endpoint and serialize the url query record', async () => {
        const summary : QuerySummaryMedication = {
            recommendations: {
                overallDistribution: {
                    total: 1,
                    elements: [{ key: { code: 'L01EC02' }, value: { count: 1, percent: 100 } }],
                },
                distributionBySupportingVariant: [
                    {
                        key: { gene: { code: 'BRAF' }, type: 'SNV' },
                        value: {
                            total: 1,
                            elements: [{ key: ['L01EC02'], value: { count: 1, percent: 100 } }],
                        },
                    },
                ],
            },
            therapies: {
                meanDurations: [{ key: [{ code: 'L01EC02' }], value: [{ key: [{ code: 'L01EC02' }], value: 12 }] }],
                overallDistribution: {
                    total: 1,
                    elements: [{ key: ['L01EC02'], value: { count: 1, percent: 100 } }],
                },
            },
        };

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/medication': () => summary });

        await moduleClient.query.getMedication('q-1', { 'therapy[medication]': 'L01EC02' });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/medication');
        expect(decodeURIComponent(client.requests[0]?.url ?? '')).toContain('therapy[medication]=L01EC02');
    });

    it('should address the demographics endpoint and serialize the url query record', async () => {
        const summary : QuerySummaryDemographics = {
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

        const { client, moduleClient } = createModuleClient({ 'GET /mtb/queries/:id/demographics': () => summary });

        await moduleClient.query.getDemographics('q-1', { 'diagnosis[code]': ['C25', 'C50'] });

        expect(client.requests[0]?.url).toContain('/mtb/queries/q-1/demographics');
        expect(decodeURIComponent(client.requests[0]?.url ?? '')).toContain('diagnosis[code]=C25&diagnosis[code]=C50');
    });
});

describe('buildQueryGeneAlterationCriteriaLabel', () => {
    it('should label a gene criteria with the gene display', () => {
        const label = buildQueryGeneAlterationCriteriaLabel({ gene: { code: 'BRAF', display: 'B-Raf' } });

        expect(label).toBe('B-Raf');
    });

    it('should fall back to the gene code', () => {
        const label = buildQueryGeneAlterationCriteriaLabel({ gene: { code: 'BRAF' } });

        expect(label).toBe('BRAF');
    });

    it('should append the alteration type', () => {
        const label = buildQueryGeneAlterationCriteriaLabel({
            gene: { code: 'ERBB2' },
            alteration: {
                type: 'CNV',
                copyNumberType: [{ code: 'high-level-gain' }],
            },
        });

        expect(label).toBe('ERBB2 CNV');
    });

    it('should build no label without a gene', () => {
        const label = buildQueryGeneAlterationCriteriaLabel({} as QueryGeneAlterationCriteria);

        expect(label).toBeUndefined();
    });
});
