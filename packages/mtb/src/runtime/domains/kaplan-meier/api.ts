/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseAPI } from '@dnpm-dip/http-kit';
import type {
    IKaplanMeierAPI,
    KaplanMeierOptionsResponse,
} from './types';

export class KaplanMeierAPI extends BaseAPI implements IKaplanMeierAPI {
    async getOptions() : Promise<KaplanMeierOptionsResponse> {
        const response = await this.client.get('mtb/kaplan-meier/config');
        return response.data;
    }
}
