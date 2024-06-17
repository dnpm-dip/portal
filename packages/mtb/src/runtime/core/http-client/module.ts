import type { HTTPClient } from '@dnpm-dip/core';
import {
    KaplanMeierAPI,
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly kaplanMeier : KaplanMeierAPI;

    readonly query : QueryAPI;

    constructor(client: HTTPClient) {
        this.kaplanMeier = new KaplanMeierAPI({ client });
        this.query = new QueryAPI({ client });
    }
}
