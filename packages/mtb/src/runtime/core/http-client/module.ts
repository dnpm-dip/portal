import type { HTTPClient } from '@dnpm-dip/core';
import {
    KaplanMeierAPI,
    QueryAPI,
    ValidationAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly kaplanMeier : KaplanMeierAPI;

    readonly query : QueryAPI;

    readonly validation : ValidationAPI;

    constructor(client: HTTPClient) {
        this.kaplanMeier = new KaplanMeierAPI({ client });
        this.query = new QueryAPI({ client });
        this.validation = new ValidationAPI({ client });
    }
}
