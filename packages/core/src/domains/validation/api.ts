/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseAPI } from '../api';
import type { BaseAPIContext, ResourceCollectionResponse } from '../types';
import type { ValidationReport, ValidationReportInfo } from './types';

export class ValidationAPI extends BaseAPI {
    protected useCase : string;

    constructor(ctx: BaseAPIContext & { useCase: string }) {
        super(ctx);

        this.useCase = ctx.useCase;
    }

    async getReportInfo() : Promise<ResourceCollectionResponse<ValidationReportInfo>> {
        const response = await this.client.get(`${this.useCase}/validation/infos`);
        return response.data;
    }

    async getReport(id: string) : Promise<ValidationReport> {
        const response = await this.client.get(`${this.useCase}/validation/report/${id}`);
        return response.data;
    }

    async getPatientRecord(id: string) {
        const response = await this.client.get(`${this.useCase}/validation/patient-record/${id}`);
        return response.data;
    }
}
