import type { App } from 'vue';
import { hasInjectionContext, inject, provide } from 'vue';
import type { APIClient } from './module';

export const APIClientSymbol = Symbol.for('APIClient');

export function isAPIClientInjected() {
    if (!hasInjectionContext()) {
        return false;
    }

    const instance = inject(APIClientSymbol);
    return !!instance;
}

export function provideAPIClient(client: APIClient, app?: App) {
    if (typeof app === 'undefined') {
        if (isAPIClientInjected()) {
            return;
        }

        provide(APIClientSymbol, client);
        return;
    }

    if (
        app._context &&
        app._context.provides &&
        app._context.provides[APIClientSymbol]
    ) {
        return;
    }

    app.provide(APIClientSymbol, client);
}

export function injectAPIClient() {
    const instance = inject(APIClientSymbol);
    if (!instance) {
        throw new Error('The APIClient is not set.');
    }

    return instance as APIClient;
}
