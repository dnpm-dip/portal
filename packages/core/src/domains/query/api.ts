import { BaseAPI } from '../api';
import type { QueryBase } from './types';

export class QueryAPI extends BaseAPI {
    async getOne(
        useCase: string,
        id: string,
    ) : Promise<QueryBase> {
        const response = await this.client.get(`${useCase}/queries/${id}`);
        return response.data;
    }
}
