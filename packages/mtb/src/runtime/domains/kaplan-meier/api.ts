/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ResourceCollectionResponse } from '@dnpm-dip/core';
import { BaseAPI } from '@dnpm-dip/core';
import type {
    KaplanMeierOptions,
} from './types';

export class KaplanMeierAPI extends BaseAPI {
    async getOptions() : Promise<ResourceCollectionResponse<KaplanMeierOptions>> {
        const response = await this.client.get('mtb/kaplan-meier/config');
        return response.data;
    }
}
