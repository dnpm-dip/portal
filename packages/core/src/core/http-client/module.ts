import { Client as BaseClient } from 'hapic';
import { AdminAPI, CodeSystemAPI, ValueSetAPI } from '../../domains';
import type { HTTPClientOptions } from './types';

export class HTTPClient extends BaseClient {
    readonly admin : AdminAPI;

    readonly codeSystem: CodeSystemAPI;

    readonly valueSet : ValueSetAPI;

    constructor(options: HTTPClientOptions = {}) {
        super(options);

        this.admin = new AdminAPI({ client: this });
        this.codeSystem = new CodeSystemAPI({ client: this });
        this.valueSet = new ValueSetAPI({ client: this });
    }
}
