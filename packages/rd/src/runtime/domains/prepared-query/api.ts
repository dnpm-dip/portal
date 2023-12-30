import type { CollectionResponse, ResourceCollectionLoadResponse } from '@dnpm-dip/core';
import { BaseAPI } from '@dnpm-dip/core';
import type {
    RDPreparedQuery,
    RDPreparedQueryCreate,
    RDPreparedQueryUpdate,
} from './types';

export class PreparedQueryAPI extends BaseAPI {
    async create(data: RDPreparedQueryCreate) : Promise<RDPreparedQuery> {
        const response = await this.client.post('rd/prepared-queries', data);
        return response.data;
    }

    async getOne(id: string) : Promise<RDPreparedQuery> {
        const response = await this.client.get(`rd/prepared-queries/${id}`);
        return response.data;
    }

    async getMany() : Promise<CollectionResponse<RDPreparedQuery>> {
        const response = await this.client.get('rd/prepared-queries');
        return response.data;
    }

    async update(id: string, data: RDPreparedQueryUpdate) : Promise<RDPreparedQuery> {
        const response = await this.client.patch(`rd/prepared-queries/${id}`, data);
        return response.data;
    }

    async delete(id: string) : Promise<RDPreparedQuery> {
        const response = await this.client.delete(`rd/prepared-queries/${id}`);
        return response.data;
    }
}
