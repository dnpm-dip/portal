import type {
    KMSurvivalReport, PatientFilter,
    QuerySummaryDemographics,
    ResourceCollectionLoadMeta,
    ResourceCollectionResponse,
    URLQueryRecord,
} from '@dnpm-dip/core';
import { BaseAPI, QueryRequestMode, serializeURLQueryRecord } from '@dnpm-dip/core';
import type { PatientMatch, PatientRecord } from '../patient';
import type {
    QueryDiagnosisFilter, QuerySession,
    QuerySessionCreate,
    QuerySummaryMedication,
    QuerySummaryTumorDiagnostics, QueryTherapyImplementedFilter,
    QueryTherapyRecommendedFilter,
    QueryTherapyResponse, QueryTherapyResponseByVariant,
} from './types';

export class QueryAPI extends BaseAPI {
    /**
     * Create a query session.
     *
     * @param query
     */
    async submit(query: QuerySessionCreate) : Promise<QuerySession> {
        query.mode = query.mode || {
            code: QueryRequestMode.LOCAL,
        };

        const response = await this.client.post('mtb/queries', query);
        return response.data;
    }

    async getOne(id: string) : Promise<QuerySession> {
        const response = await this.client.get(`mtb/queries/${id}`);
        return response.data;
    }

    /**
     * Refresh the query session.
     *
     * @param id
     * @param query
     */
    async update(id: string, query?: QuerySessionCreate) : Promise<QuerySession> {
        const response = await this.client.put(`mtb/queries/${id}`, query);
        return response.data;
    }

    // --------------------------------------------------------------------

    async getDiagnosisFilter(id: string) : Promise<QueryDiagnosisFilter> {
        const response = await this.client.get(`mtb/queries/${id}/filters/diagnosis`);
        return response.data;
    }

    async getTherapyImplementedFilter(id: string) : Promise<QueryTherapyImplementedFilter> {
        const response = await this.client.get(`mtb/queries/${id}/filters/therapy`);
        return response.data;
    }

    async getTherapyRecommendedFilter(id: string) : Promise<QueryTherapyRecommendedFilter> {
        const response = await this.client.get(`mtb/queries/${id}/filters/therapy-recommendation`);
        return response.data;
    }

    // --------------------------------------------------------------------

    /**
     * Get all patients in the context of a specific query.
     * @param id
     * @param meta
     * @throws ClientError
     */
    async getPatients(id: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<PatientMatch>> {
        let qs : string = '';
        if (typeof meta !== 'undefined') {
            const { filters, limit, offset } = meta;

            const queryRecord : URLQueryRecord = {
                ...(filters || {}),
            };
            if (typeof limit !== 'undefined') {
                queryRecord.limit = limit;
            }

            if (typeof offset !== 'undefined') {
                queryRecord.offset = offset;
            }

            qs = serializeURLQueryRecord(queryRecord);
            if (qs.length > 0) {
                qs = `?${qs}`;
            }
        }

        const response = await this.client.get(`mtb/queries/${id}/patient-matches${qs}`);
        return response.data;
    }

    async getPatientRecord(queryId: string, patientId: string) : Promise<PatientRecord> {
        const response = await this.client.get(`mtb/queries/${queryId}/patient-record/${patientId}`);
        return response.data;
    }

    // --------------------------------------------------------------------

    async getKaplanMeierStatistics(
        queryId: string,
        type?: string,
        grouping?: string,
    ) : Promise<KMSurvivalReport> {
        const qParts : string[] = [];
        if (type) {
            qParts.push(`type=${type}`);
        }
        if (grouping) {
            qParts.push(`grouping=${grouping}`);
        }

        const qs = qParts.length > 0 ? `?${qParts.join('&')}` : '';
        const response = await this.client.get(`mtb/queries/${queryId}/survival-statistics${qs}`);
        return response.data;
    }

    async getTherapyResponses(queryId: string, query?: URLQueryRecord) : Promise<ResourceCollectionResponse<QueryTherapyResponse>> {
        const response = await this.client.get(`mtb/queries/${queryId}/therapy-responses${this.buildRequestQueryString(query)}`);
        return response.data;
    }

    async getTherapyResponsesByVariant(queryId: string, query?: URLQueryRecord) : Promise<ResourceCollectionResponse<QueryTherapyResponseByVariant>> {
        const response = await this.client.get(`mtb/queries/${queryId}/therapy-responses-by-variant${this.buildRequestQueryString(query)}`);
        return response.data;
    }

    async getTumorDiagnostics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryTumorDiagnostics> {
        const response = await this.client.get(`mtb/queries/${queryId}/tumor-diagnostics${this.buildRequestQueryString(query)}`);
        return response.data;
    }

    async getMedication(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryMedication> {
        const response = await this.client.get(`mtb/queries/${queryId}/medication${this.buildRequestQueryString(query)}`);
        return response.data;
    }

    async getDemographics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryDemographics> {
        const response = await this.client.get(`mtb/queries/${queryId}/demographics${this.buildRequestQueryString(query)}`);
        return response.data;
    }

    // --------------------------------------------------------------------

    private buildRequestQueryString(query?: URLQueryRecord) {
        let qs : string = '';
        if (typeof query !== 'undefined') {
            qs = serializeURLQueryRecord(query);
            if (qs.length > 0) {
                qs = `?${qs}`;
            }
        }

        return qs;
    }
}
