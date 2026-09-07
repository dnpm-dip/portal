import {
    type IHTTPClient,
    type IPreparedQueryAPI,
    PreparedQueryAPI,
} from '@dnpm-dip/http-kit';
import {
    type IQueryAPI,
    QueryAPI,
} from '../../domains';

export interface IRDHTTPClient {
    readonly query : IQueryAPI;
    readonly preparedQuery : IPreparedQueryAPI;
}

export class RDHTTPClient implements IRDHTTPClient {
    readonly query : QueryAPI;

    readonly preparedQuery : PreparedQueryAPI;

    constructor(client: IHTTPClient) {
        this.query = new QueryAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'rd' });
    }
}
