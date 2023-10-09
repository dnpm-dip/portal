import { BaseAPI } from '../api';

export class CodeSystemAPI extends BaseAPI {
    async getMany() {
        const response = await this.client.get('coding/codesystems');
        return response.data;
    }

    async getOne(id: string) {
        const response = await this.client.get(`coding/codesystems?uri=${id}`);
        return response.data;
    }
}
