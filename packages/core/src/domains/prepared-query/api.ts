import { BaseAPI } from '../api';
import type { BaseAPIContext, ResourceCollectionResponse } from '../types';

import type {
    PreparedQuery,
    PreparedQueryCreate,
    PreparedQueryUpdate,
} from './types';

export class PreparedQueryAPI extends BaseAPI {
    protected useCase : string;

    constructor(ctx: BaseAPIContext & { useCase: string }) {
        super(ctx);

        this.useCase = ctx.useCase;
    }

    async create(data: PreparedQueryCreate) : Promise<PreparedQuery> {
        const response = await this.client.post(`${this.useCase}/prepared-queries`, this.extendPayload(data));
        return response.data;
    }

    async getOne(id: string) : Promise<PreparedQuery> {
        const response = await this.client.get(`${this.useCase}/prepared-queries/${id}`);
        return response.data;
    }

    async getMany() : Promise<ResourceCollectionResponse<PreparedQuery>> {
        const response = await this.client.get(`${this.useCase}/prepared-queries`);
        return response.data;
    }

    async update(id: string, data: PreparedQueryUpdate) : Promise<PreparedQuery> {
        const response = await this.client.patch(`${this.useCase}/prepared-queries/${id}`, this.extendPayload(data));
        return response.data;
    }

    async delete(id: string) : Promise<PreparedQuery> {
        const response = await this.client.delete(`${this.useCase}/prepared-queries/${id}`);
        return response.data;
    }

    protected extendPayload(data: Partial<PreparedQuery>) : Partial<PreparedQuery> {
        if (!data.name) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Monat 0-basiert, daher +1
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            data.name = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        return data;
    }
}
