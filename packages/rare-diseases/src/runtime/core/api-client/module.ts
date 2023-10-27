import type { APIClient } from '@dnpm-dip/core';
import { QueryAPI } from '../../domains/query';

export class RDAPIClient {
    readonly query : QueryAPI;

    constructor(client: APIClient) {
        this.query = new QueryAPI({ client });
    }
}
