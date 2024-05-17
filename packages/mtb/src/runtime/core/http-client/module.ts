import type { HTTPClient } from '@dnpm-dip/core';
import {
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly query : QueryAPI;

    constructor(client: HTTPClient) {
        this.query = new QueryAPI({ client });
    }
}
