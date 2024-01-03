import type { APIClient } from '@dnpm-dip/core';
import {
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly query : QueryAPI;

    constructor(client: APIClient) {
        this.query = new QueryAPI({ client });
    }
}
