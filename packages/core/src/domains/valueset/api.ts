import { BaseAPI } from '../api';
import type { CollectionResponse } from '../types';
import type { ValueSet } from './types';

export class ValueSetAPI extends BaseAPI {
    async getMany() : Promise<CollectionResponse<ValueSet>> {
        const response = await this.client.get('coding/valuesets');
        return response.data;
    }

    async getOne(id: string, version?: string) : Promise<ValueSet> {
        const query : string[] = [
            `uri=${id}`,
        ];

        if (version) {
            query.push(`version=${version}`);
        }

        const response = await this.client.get(`coding/valuesets?${query.join('&')}`);
        return response.data;
    }
}
