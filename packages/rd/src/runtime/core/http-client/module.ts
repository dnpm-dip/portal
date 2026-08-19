import { PreparedQueryAPI } from '@dnpm-dip/http-kit';
import type { IHTTPClient } from '@dnpm-dip/http-kit';
import {
    QueryAPI,
} from '../../domains';

export class RDHTTPClient {
    readonly query : QueryAPI;

    readonly preparedQuery : PreparedQueryAPI;

    constructor(client: IHTTPClient) {
        this.query = new QueryAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'rd' });
    }
}
