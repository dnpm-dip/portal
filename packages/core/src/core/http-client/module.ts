import { Client as BaseClient } from 'hapic';
import {
    CodeSystemAPI,
    QueryAPI,
    SiteAPI,
    ValueSetAPI,
} from '../../domains';

import type { HTTPClientOptions } from './types';

export class HTTPClient extends BaseClient {
    readonly codeSystem: CodeSystemAPI;

    readonly query: QueryAPI;

    readonly site : SiteAPI;

    readonly valueSet : ValueSetAPI;

    constructor(options: HTTPClientOptions = {}) {
        super(options);

        this.codeSystem = new CodeSystemAPI({ client: this });
        this.query = new QueryAPI({ client: this });
        this.site = new SiteAPI({ client: this });
        this.valueSet = new ValueSetAPI({ client: this });
    }
}
