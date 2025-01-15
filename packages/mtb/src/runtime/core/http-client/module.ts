import {
    type HTTPClient,
    PreparedQueryAPI,
    ValidationAPI,
} from '@dnpm-dip/core';
import {
    KaplanMeierAPI,
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly kaplanMeier : KaplanMeierAPI;

    readonly preparedQuery : PreparedQueryAPI;

    readonly query : QueryAPI;

    readonly validation : ValidationAPI;

    constructor(client: HTTPClient) {
        this.kaplanMeier = new KaplanMeierAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'mtb' });
        this.query = new QueryAPI({ client });
        this.validation = new ValidationAPI({ client, useCase: 'mtb' });
    }
}
