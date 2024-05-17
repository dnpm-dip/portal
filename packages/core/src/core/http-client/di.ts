import type { App } from 'vue';
import { inject } from '../inject';
import { provide } from '../provide';
import type { HTTPClient } from './module';

export const APIClientSymbol = Symbol.for('APIClient');

export function isAPIClientInjected(app?: App) {
    return !!inject(APIClientSymbol, app);
}

export function provideHTTPClient(client: HTTPClient, app?: App) {
    provide(APIClientSymbol, client, app);
}

export function injectHTTPClient() {
    const instance = inject<HTTPClient>(APIClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance;
}
