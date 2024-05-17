import type { HTTPClient } from '@dnpm-dip/core';
import {
    PreparedQueryAPI,
    QueryAPI,
} from '../../domains';

export class RDAPIClient {
    readonly query : QueryAPI;

    readonly preparedQuery : PreparedQueryAPI;

    constructor(client: HTTPClient) {
        this.query = new QueryAPI({ client });
        this.preparedQuery = new PreparedQueryAPI({ client });
    }
}
