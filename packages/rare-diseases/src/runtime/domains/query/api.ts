import type {
    CollectionResponse, ResourceCollectionLoadMeta, URLQueryRecord,
} from '@dnpm-dip/core';
import { BaseAPI, serializeURLQueryRecord } from '@dnpm-dip/core';
import type { RDPatientMatch, RDPatientRecord } from '../patient';
import { QueryRequestMode } from './constants';
import type {
    RDQuerySession, RDQuerySessionCreate, RDQuerySummary,
} from './types';

export class QueryAPI extends BaseAPI {
    /**
     * Create a query session.
     *
     * @param query
     */
    async submit(query: RDQuerySessionCreate) : Promise<RDQuerySession> {
        query.mode = query.mode || {
            code: QueryRequestMode.LOCAL,
        };

        const response = await this.client.post('rd/queries', query);
        return response.data;
    }

    async getOne(id: string) : Promise<RDQuerySession> {
        const response = await this.client.get(`rd/queries/${id}`);
        return response.data;
    }

    /**
     * Refresh the query session.
     *
     * @param id
     * @param query
     */
    async update(id: string, query?: RDQuerySessionCreate) : Promise<RDQuerySession> {
        const response = await this.client.put(`rd/queries/${id}`, query);
        return response.data;
    }

    /**
     * Get a summary/overview in the context of a specific query.
     *
     * @param id
     * @param query
     */
    async getSummary(id: string, query?: URLQueryRecord) : Promise<RDQuerySummary> {
        let qs : string = '';
        if (typeof query !== 'undefined') {
            qs = serializeURLQueryRecord(query);
            if (qs.length > 0) {
                qs = `?${qs}`;
            }
        }

        const response = await this.client.get(`rd/queries/${id}/summary${qs}`);
        return response.data;
    }

    /**
     * Get all patients in the context of a specific query.
     * @param id
     * @param meta
     * @throws ClientError
     */
    async getPatients(id: string, meta?: ResourceCollectionLoadMeta) : Promise<CollectionResponse<RDPatientMatch>> {
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

        const response = await this.client.get(`rd/queries/${id}/patient-matches${qs}`);
        return response.data;
    }

    /**
     * Get an individual patient in the context of a specific query.
     *
     * @param queryId
     * @param patientId
     */
    async getPatientRecord(queryId: string, patientId: string) : Promise<RDPatientRecord> {
        const response = await this.client.get(`rd/queries/${queryId}/patient-record/${patientId}`);
        return response.data;
    }
}
