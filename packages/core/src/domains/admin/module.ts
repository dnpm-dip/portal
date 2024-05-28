/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseAPI } from '../api';
import type { AdminConnectionReport } from './types';

export class AdminAPI extends BaseAPI {
    async getConnectionReport() : Promise<AdminConnectionReport> {
        const response = await this.client.get('admin/connection-report');
        return response.data;
    }
}
