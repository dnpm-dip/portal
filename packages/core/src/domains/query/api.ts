import { BaseAPI } from '../api';
import type { PatientFilter } from '../patient';
import type { QueryBase } from './types';

export class QueryAPI extends BaseAPI {
    async getOne(
        useCase: string,
        id: string,
    ) : Promise<QueryBase> {
        const response = await this.client.get(`${useCase}/queries/${id}`);
        return response.data;
    }

    async getPatientFilter(
        useCase: string,
        id: string,
    ) : Promise<PatientFilter> {
        const response = await this.client.get(`${useCase}/queries/${id}/filters/patient`);
        return response.data;
    }
}
