import { createClient, isClient } from 'hapic';
import type { IClient, RequestBaseOptions } from 'hapic';
import type { BaseAPIContext } from './types';

export class BaseAPI {
    protected client! : IClient;

    // -----------------------------------------------------------------------------------

    constructor(context?: BaseAPIContext) {
        context = context || {};

        this.setClient(context.client);
    }

    // -----------------------------------------------------------------------------------

    setClient(input?: IClient | RequestBaseOptions) {
        this.client = isClient(input) ?
            input :
            createClient(input);
    }
}
