import { Client as BaseClient } from 'hapic';
import { CodeSystemAPI, QueryAPI } from '../../domains';
import type { APIClientConfigInput } from './types';

export class APIClient extends BaseClient {
    readonly codeSystem: CodeSystemAPI;

    readonly query : QueryAPI;

    constructor(config?: APIClientConfigInput) {
        super(config);

        this.codeSystem = new CodeSystemAPI({ client: this });
        this.query = new QueryAPI({ client: this });
    }
}
