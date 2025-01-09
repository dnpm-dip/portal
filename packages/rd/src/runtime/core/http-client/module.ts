import { PreparedQueryAPI } from '@dnpm-dip/core';
import type { HTTPClient } from '@dnpm-dip/core';
import {
    QueryAPI,
} from '../../domains';

export class RDHTTPClient {
    readonly query : QueryAPI;

    readonly preparedQuery : PreparedQueryAPI;

    constructor(client: HTTPClient) {
        this.query = new QueryAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client, useCase: 'rd' });
    }
}
