/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseAPI } from '../api';
import type { SiteResponse } from './types';

export class SiteAPI extends BaseAPI {
    async getItems(useCase: string) : Promise<SiteResponse> {
        const response = await this.client.get(`${useCase}/sites`);
        return response.data;
    }
}
