import { BaseAPI } from '../api';
import type { PatientRecord } from '../patient/types';
import type {
    QueryPatientsResponse, QuerySession, QuerySessionCreate, QuerySummary,
} from './types';

export class QueryAPI extends BaseAPI {
    /**
     * Create a query session.
     *
     * @param query
     */
    async submit(query: QuerySessionCreate) : Promise<QuerySession> {
        let uri = 'rd/query';
        if (query.mode) {
            uri += `?mode=${query.mode}`;
        }
        const response = await this.client.post(uri, query);
        return response.data;
    }

    /**
     * Refresh the query session.
     *
     * @param id
     */
    async refresh(id: string) : Promise<QuerySession> {
        const response = await this.client.put(`rd/query/${id}`);
        return response.data;
    }

    /**
     * Get a summary/overview in the context of a specific query.
     *
     * @param id
     */
    async getSummary(id: string) : Promise<QuerySummary> {
        const response = await this.client.get(`rd/query/${id}/summary`);
        return response.data;
    }

    /**
     * Get all patients in the context of a specific query.
     * @param id
     */
    async getPatients(id: string) : Promise<QueryPatientsResponse> {
        const response = await this.client.get(`rd/query/${id}/patients`);
        return response.data;
    }

    /**
     * Get an individual patient in the context of a specific query.
     *
     * @param queryId
     * @param patientId
     */
    async getPatientRecord(queryId: string, patientId: string) : Promise<PatientRecord> {
        const response = await this.client.get(`rd/query/${queryId}/patients/${patientId}`);
        return response.data;
    }
}
