import { type HTTPClient, PreparedQueryAPI } from '@dnpm-dip/core';
import {
    KaplanMeierAPI,
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly kaplanMeier : KaplanMeierAPI;

    readonly preparedQuery : PreparedQueryAPI;

    readonly query : QueryAPI;

    constructor(client: HTTPClient) {
        this.kaplanMeier = new KaplanMeierAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'mtb' });
        this.query = new QueryAPI({ client });
    }
}
