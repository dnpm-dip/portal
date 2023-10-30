import type { CollectionResponse, PatientMatch } from '@dnpm-dip/core';
import { BaseAPI } from '@dnpm-dip/core';
import type { RDPatientRecord } from '../patient-record';
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
        let uri = 'rd/query';
        if (query.mode) {
            uri += `?mode=${query.mode}`;
            delete query.mode;
        } else {
            uri += `?mode=${QueryRequestMode.LOCAL}`;
        }
        const response = await this.client.post(uri, query);
        return response.data;
    }

    async getOne(id: string) : Promise<RDQuerySession> {
        const response = await this.client.get(`rd/query/${id}`);
        return response.data;
    }

    /**
     * Refresh the query session.
     *
     * @param id
     */
    async refresh(id: string) : Promise<RDQuerySession> {
        const response = await this.client.put(`rd/query/${id}`);
        return response.data;
    }

    /**
     * Get a summary/overview in the context of a specific query.
     *
     * @param id
     */
    async getSummary(id: string) : Promise<RDQuerySummary> {
        const response = await this.client.get(`rd/query/${id}/summary`);
        return response.data;
    }

    /**
     * Get all patients in the context of a specific query.
     * @param id
     * @throws ClientError
     */
    async getPatients(id: string) : Promise<CollectionResponse<PatientMatch>> {
        const response = await this.client.get(`rd/query/${id}/patients`);
        return response.data;
    }

    /**
     * Get an individual patient in the context of a specific query.
     *
     * @param queryId
     * @param patientId
     */
    async getPatientRecord(queryId: string, patientId: string) : Promise<RDPatientRecord> {
        const response = await this.client.get(`rd/query/${queryId}/patient-record/${patientId}`);
        return response.data;
    }
}
