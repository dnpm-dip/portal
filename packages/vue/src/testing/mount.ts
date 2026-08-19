import { install as authupInstall } from '@authup/client-web-kit';
import { createFakeClient as createFakeAuthupClient } from '@authup/core-http-kit/testing';
import { mount } from '@vue/test-utils';
import vuecs from '@vuecs/core';
import { createPinia } from 'pinia';
import type { App, Component } from 'vue';
import { createFakeClient } from '@dnpm-dip/http-kit/testing';
import type { FakeClient, FakeHandlerMap } from '@dnpm-dip/http-kit/testing';
import { install } from '../install';

const noop = () => undefined;

export type MountOptions = {
    /**
     * Runs against the app BEFORE mount, so whatever it provides is visible
     * to the component's setup(). Feature modules use it to provide their own
     * client on top of the base one — providing after mount would be too late.
     */
    onApp?: (app: App, client: FakeClient) => void
};

export function mountComponent(
    component: Component,
    props: Record<string, any> = {},
    handlers: FakeHandlerMap = {},
    options: MountOptions = {},
) {
    const pinia = createPinia();
    const client = createFakeClient({ handlers });

    const wrapper = mount(component, {
        props,
        global: {
            // VCIcon resolves through @iconify/vue, which fetches an unknown
            // icon from the iconify API. Left live, every icon-rendering spec
            // makes a real request and happy-dom aborts it at teardown.
            // Stubbing by NAME also catches the VCIcon that @vuecs/button
            // imports directly, which a global registration would not.
            stubs: { VCIcon: true },
            plugins: [
                // 1. pinia — the stores are defineStore factories, and there
                //    is no ambient injection context outside Nuxt.
                pinia,
                // 2. @vuecs/core — first-install-wins theme manager.
                [vuecs, {}],
                // 3. authup BEFORE core: core's setupBaseHTTPClient calls
                //    injectHTTPClientAuthenticationHook(app) and throws
                //    without it. isServer:true maps to `timer: !isServer`,
                //    so no refresh timer leaks between specs.
                [{ install: authupInstall }, {
                    baseURL: 'http://authup.fake.test',
                    httpClient: createFakeAuthupClient({
                        handlers: {
                            'POST /token': () => ({
                                access_token: 'xyz',
                                token_type: 'Bearer',
                                expires_in: 3600,
                            }),
                        },
                    }),
                    pinia,
                    isServer: true,
                    cookieGet: noop,
                    cookieSet: noop,
                    cookieUnset: noop,
                }],
                // 4. core, with the fake passed EXPLICITLY — pre-providing
                //    would be silently ignored by the early-return.
                [{ install }, {
                    baseURL: 'http://core.fake.test',
                    httpClient: client,
                }],
                // 5. Caller hook — LAST, so the base client is already
                //    provided, but still before mount, so setup() sees it.
                { install: (app: App) => options.onApp?.(app, client) },
            ],
        },
    });

    return {
        wrapper,
        client,
        pinia,
    };
}
