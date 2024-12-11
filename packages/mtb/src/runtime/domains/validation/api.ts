/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseAPI, type ResourceCollectionResponse } from '@dnpm-dip/core';

export class ValidationAPI extends BaseAPI {
    async getValidationReport() : Promise<ResourceCollectionResponse<Record<string, any>>> {
        const response = await this.client.get('mtb/validation/infos');
        return response.data;
    }

    async getValidationPatientReport(id: string) {
        const response = await this.client.get(`mtb/validation/report/${id}`);
        return response.data;
    }

    async getValidationPatientRecord(id: string) {
        const response = await this.client.get(`mtb/validation/patient-record/${id}`);
        return response.data;
    }
}
