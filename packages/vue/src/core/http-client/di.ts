import type { App } from 'vue';
import type { IHTTPClient } from '@dnpm-dip/http-kit';
import { inject } from '../inject';
import { provide } from '../provide';

export const APIClientSymbol = Symbol.for('APIClient');

export function isHTTPIClientInjected(app?: App) {
    return !!inject(APIClientSymbol, app);
}

export function provideHTTPClient(client: IHTTPClient, app?: App) {
    provide(APIClientSymbol, client, app);
}

export function injectHTTPClient(app?: App) : IHTTPClient {
    const instance = inject<IHTTPClient>(APIClientSymbol, app);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
