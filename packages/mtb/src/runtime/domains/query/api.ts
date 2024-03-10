import type {
    ResourceCollectionLoadMeta, ResourceCollectionResponse,
    URLQueryRecord,
} from '@dnpm-dip/core';
import { BaseAPI, QueryRequestMode, serializeURLQueryRecord } from '@dnpm-dip/core';
import type { PatientMatch, PatientRecord } from '../patient';
import type {
    QuerySession,
    QuerySessionCreate,
    QuerySummary,
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

    /**
     * Get a summary/overview in the context of a specific query.
     *
     * @param id
     * @param query
     */
    async getSummary(id: string, query?: URLQueryRecord) : Promise<QuerySummary> {
        let qs : string = '';
        if (typeof query !== 'undefined') {
            qs = serializeURLQueryRecord(query);
            if (qs.length > 0) {
                qs = `?${qs}`;
            }
        }

        const response = await this.client.get(`mtb/queries/${id}/summary${qs}`);
        return response.data;
    }

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
}
