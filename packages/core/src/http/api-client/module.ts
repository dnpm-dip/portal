import { Client as BaseClient } from 'hapic';
import { CodeSystemAPI, ValueSetAPI } from '../../domains';
import type { APIClientConfigInput } from './types';

export class APIClient extends BaseClient {
    readonly codeSystem: CodeSystemAPI;

    readonly valueSet : ValueSetAPI;

    constructor(config?: APIClientConfigInput) {
        super(config);

        this.codeSystem = new CodeSystemAPI({ client: this });
        this.valueSet = new ValueSetAPI({ client: this });
    }
}
