import type { ResourceCollectionLoadResponse, ResourceCollectionResponse } from '@dnpm-dip/core';
import { BaseAPI } from '@dnpm-dip/core';
import type {
    PreparedQuery,
    PreparedQueryCreate,
    PreparedQueryUpdate,
} from './types';

export class PreparedQueryAPI extends BaseAPI {
    async create(data: PreparedQueryCreate) : Promise<PreparedQuery> {
        const response = await this.client.post('rd/prepared-queries', data);
        return response.data;
    }

    async getOne(id: string) : Promise<PreparedQuery> {
        const response = await this.client.get(`rd/prepared-queries/${id}`);
        return response.data;
    }

    async getMany() : Promise<ResourceCollectionResponse<PreparedQuery>> {
        const response = await this.client.get('rd/prepared-queries');
        return response.data;
    }

    async update(id: string, data: PreparedQueryUpdate) : Promise<PreparedQuery> {
        const response = await this.client.patch(`rd/prepared-queries/${id}`, data);
        return response.data;
    }

    async delete(id: string) : Promise<PreparedQuery> {
        const response = await this.client.delete(`rd/prepared-queries/${id}`);
        return response.data;
    }
}
