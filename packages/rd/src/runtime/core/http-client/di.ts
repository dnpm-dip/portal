import type { App } from 'vue';
import { inject, provide } from '@dnpm-dip/vue';
import type { IRDHTTPClient } from './module';

export const HTTPClientSymbol = Symbol.for('RDHTTPClient');

export function isHTTPClientUsable(app?: App) {
    return !!inject(HTTPClientSymbol, app);
}

export function provideHTTPClient(client: IRDHTTPClient, app?: App) {
    provide(HTTPClientSymbol, client, app);
}

export function injectHTTPClient() : IRDHTTPClient {
    const instance = inject<IRDHTTPClient>(HTTPClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
