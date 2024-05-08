/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { APIClient as DNPMAPIClient } from '@dnpm-dip/core';
import type { ClientOptions, ClientResponseErrorTokenHookOptions } from '@authup/core-http-kit';
import {
    Client as AuthupAPIClient,
    ClientResponseErrorTokenHook,
} from '@authup/core-http-kit';
import type { Pinia } from 'pinia';
import { storeToRefs } from 'pinia';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '../stores/auth';

declare module '#app' {
    interface NuxtApp {
        $api: AuthupAPIClient;
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $api: AuthupAPIClient;
    }
}

export default defineNuxtPlugin({
    async setup(nuxt) {
        const runtimeConfig = useRuntimeConfig();

        const { authupUrl: baseURL } = runtimeConfig.public;

        const config: ClientOptions = {
            baseURL,
        };
        const authupAPIClient = new AuthupAPIClient(config);

        const store = useAuthStore(nuxt.$pinia as Pinia);

        const options : ClientResponseErrorTokenHookOptions = {
            baseURL,
            tokenCreator: () => {
                const { refreshToken } = storeToRefs(store);

                if (!refreshToken.value) {
                    throw new Error('No refresh token available.');
                }

                return authupAPIClient.token.createWithRefreshToken({
                    refresh_token: refreshToken.value,
                });
            },
            tokenCreated: (response) => {
                store.setAccessTokenExpireDate(undefined);

                setTimeout(() => {
                    store.handleTokenGrantResponse(response);
                }, 0);
            },
            tokenFailed: () => {
                store.logout();
            },
        };

        const authupTokenHook = new ClientResponseErrorTokenHook(authupAPIClient, options);
        const coreTokenHook = new ClientResponseErrorTokenHook(nuxt.$api as DNPMAPIClient, options);

        store.$subscribe((mutation, state) => {
            if (mutation.storeId !== 'auth') return;

            if (state.accessToken) {
                authupAPIClient.setAuthorizationHeader({
                    type: 'Bearer',
                    token: state.accessToken,
                });

                authupTokenHook.mount();
                coreTokenHook.mount();
            } else {
                authupAPIClient.unsetAuthorizationHeader();

                authupTokenHook.unmount();
                coreTokenHook.unmount();
            }

            if (
                state.refreshToken &&
                state.accessTokenExpireDate
            ) {
                const expiresIn = Math.floor((state.accessTokenExpireDate.getTime() - Date.now()) / 1000);

                authupTokenHook.setTimer({
                    refresh_token: state.refreshToken,
                    expires_in: expiresIn,
                });
            }
        });

        nuxt.provide('authupApi', authupAPIClient);
    },
});
