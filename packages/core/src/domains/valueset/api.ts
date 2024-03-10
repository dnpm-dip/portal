import { BaseAPI } from '../api';
import type { ResourceCollectionResponse } from '../types';
import type { ValueSet } from './types';

export class ValueSetAPI extends BaseAPI {
    async getMany() : Promise<ResourceCollectionResponse<ValueSet>> {
        const response = await this.client.get('coding/valuesets');
        return response.data;
    }

    async getOne(
        id: string,
        version?: string,
        filter?: string[],
    ) : Promise<ValueSet> {
        const query : string[] = [
            `uri=${id}`,
        ];

        if (version) {
            query.push(`version=${version}`);
        }

        if (filter && filter.length > 0) {
            for (let i = 0; i < filter.length; i++) {
                query.push(`filter=${filter[i]}`);
            }
        }

        const response = await this.client.get(`coding/valuesets?${query.join('&')}`);
        return response.data;
    }
}
