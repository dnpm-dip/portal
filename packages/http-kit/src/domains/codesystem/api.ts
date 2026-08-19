import { BaseAPI } from '../api';
import type { ResourceCollectionResponse, ResourceRecordResponse } from '../types';
import type { CodeSystem, ICodeSystemAPI } from './types';

export class CodeSystemAPI extends BaseAPI implements ICodeSystemAPI {
    async getMany() : Promise<ResourceCollectionResponse<CodeSystem>> {
        const response = await this.client.get('coding/codesystems');
        return response.data;
    }

    async getOne(id: string, filter?: string[]) : Promise<ResourceRecordResponse<CodeSystem>> {
        let queryString : string = '';
        if (filter && filter.length > 0) {
            const searchParams = new URLSearchParams();
            for (const value of filter) {
                searchParams.append('filter', value);
            }

            queryString = `&${searchParams.toString()}`;
        }

        const response = await this.client.get(`coding/codesystems?uri=${id}${queryString}`);
        return response.data;
    }
}
