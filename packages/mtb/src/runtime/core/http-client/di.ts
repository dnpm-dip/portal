import type { App } from 'vue';
import { inject, provide } from '@dnpm-dip/core';
import type { MTBAPIClient as HTTPClient } from './module';

export const HTTPClientSymbol = Symbol.for('MTBHTTPClient');

export function isHTTPClientUsable(app?: App) {
    return !!inject(HTTPClientSymbol, app);
}

export function provideHTTPClient(client: HTTPClient, app?: App) {
    provide(HTTPClientSymbol, client, app);
}

export function injectHTTPClient() {
    const instance = inject<HTTPClient>(HTTPClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
