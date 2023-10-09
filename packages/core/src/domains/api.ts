import { createClient, isClient } from 'hapic';
import type { Client, RequestBaseOptions } from 'hapic';
import type { BaseAPIContext } from './types';

export class BaseAPI {
    protected client! : Client;

    // -----------------------------------------------------------------------------------

    constructor(context?: BaseAPIContext) {
        context = context || {};

        this.setClient(context.client);
    }

    // -----------------------------------------------------------------------------------

    setClient(input?: Client | RequestBaseOptions) {
        this.client = isClient(input) ?
            input :
            createClient(input);
    }
}
