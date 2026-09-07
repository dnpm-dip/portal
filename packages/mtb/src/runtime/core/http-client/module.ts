import {
    type IHTTPClient,
    type IPreparedQueryAPI,
    type IValidationAPI,
    PreparedQueryAPI,
    ValidationAPI,
} from '@dnpm-dip/http-kit';
import {
    type IKaplanMeierAPI,
    type IQueryAPI,
    KaplanMeierAPI,
    QueryAPI,
} from '../../domains';

export interface IMTBAPIClient {
    readonly kaplanMeier : IKaplanMeierAPI;
    readonly preparedQuery : IPreparedQueryAPI;
    readonly query : IQueryAPI;
    readonly validation : IValidationAPI;
}

export class MTBAPIClient implements IMTBAPIClient {
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
