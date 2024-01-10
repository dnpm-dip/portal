import { BaseAPI } from '../api';
import type { CollectionResponse } from '../types';
import type { CodeSystem } from './types';

export class CodeSystemAPI extends BaseAPI {
    async getMany() : Promise<CollectionResponse<CodeSystem>> {
        const response = await this.client.get('coding/codesystems');
        return response.data;
    }

    async getOne(id: string) : Promise<CodeSystem> {
        const response = await this.client.get(`coding/codesystems?uri=${id}`);
        return response.data;
    }
}
