import type {
    URLQueryRecord,
} from '@dnpm-dip/core';
import { BaseAPI, QueryRequestMode, serializeURLQueryRecord } from '@dnpm-dip/core';
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
}
