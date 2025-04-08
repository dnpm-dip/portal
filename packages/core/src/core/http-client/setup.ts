/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Client as BaseClient } from 'hapic';
import {
    STORE_ID, injectHTTPClient, injectStoreFactory, storeToRefs,
} from '@authup/client-web-kit';
import { ClientResponseErrorTokenHook } from '@authup/core-http-kit';
import type { App } from 'vue';

export function setupBaseHTTPClient(app: App, client: BaseClient) {
    const storeFactory = injectStoreFactory(app);
    const store = storeFactory();
    const { accessToken, refreshToken } = storeToRefs(store);

    const authupClient = injectHTTPClient(app);

    const tokenHook = new ClientResponseErrorTokenHook(
        {
            baseURL: authupClient.getBaseURL(),
            tokenCreator: () => {
                if (!refreshToken.value) {
                    throw new Error('No refresh token available.');
                }

                return authupClient.token.createWithRefreshToken({
                    refresh_token: refreshToken.value,
                });
            },
            timer: false,
        },
    );

    tokenHook.on('refreshFinished', (response) => {
        store.applyTokenGrantResponse(response);
    });

    tokenHook.on('refreshFailed', () => {
        store.logout();
    });

    if (accessToken.value) {
        tokenHook.mount(client);
    }

    store.$subscribe((mutation, state) => {
        if (mutation.storeId !== STORE_ID) return;

        if (state.accessToken) {
            client.setAuthorizationHeader({
                type: 'Bearer',
                token: state.accessToken,
            });

            tokenHook.mount(client);
        } else {
            client.unsetAuthorizationHeader();

            tokenHook.unmount(client);
        }
    });
}
