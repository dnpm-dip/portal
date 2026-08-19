import {
    type IHTTPClient,
    PreparedQueryAPI,
    ValidationAPI,
} from '@dnpm-dip/http-kit';
import {
    KaplanMeierAPI,
    QueryAPI,
} from '../../domains';

export class MTBAPIClient {
    readonly kaplanMeier : KaplanMeierAPI;

    readonly preparedQuery : PreparedQueryAPI;

    readonly query : QueryAPI;

    readonly validation : ValidationAPI;

    constructor(client: IHTTPClient) {
        this.kaplanMeier = new KaplanMeierAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'mtb' });
        this.query = new QueryAPI({ client });
        this.validation = new ValidationAPI({ client, useCase: 'mtb' });
    }
}
