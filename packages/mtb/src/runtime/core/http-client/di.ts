import type { App } from 'vue';
import { inject, provide } from '@dnpm-dip/vue';
import type { IMTBAPIClient } from './module';

export const HTTPClientSymbol = Symbol.for('MTBHTTPClient');

export function isHTTPClientUsable(app?: App) {
    return !!inject(HTTPClientSymbol, app);
}

export function provideHTTPClient(client: IMTBAPIClient, app?: App) {
    provide(HTTPClientSymbol, client, app);
}

export function injectHTTPClient() : IMTBAPIClient {
    const instance = inject<IMTBAPIClient>(HTTPClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
