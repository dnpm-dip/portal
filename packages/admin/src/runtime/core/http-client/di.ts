import type { App } from 'vue';
import { inject, provide } from '@dnpm-dip/vue';
import type { IAdminAPIClient } from './module';

export const HTTPClientSymbol = Symbol.for('AdminHTTPClient');

export function isHTTPClientUsable(app?: App) {
    return !!inject(HTTPClientSymbol, app);
}

export function provideHTTPClient(client: IAdminAPIClient, app?: App) {
    provide(HTTPClientSymbol, client, app);
}

export function injectHTTPClient() : IAdminAPIClient {
    const instance = inject<IAdminAPIClient>(HTTPClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
