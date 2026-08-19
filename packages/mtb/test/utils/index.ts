import { createFakeClient, mountComponent } from '@dnpm-dip/core/testing';
import type { FakeHandlerMap } from '@dnpm-dip/core/testing';
import type { Component } from 'vue';
import { MTBAPIClient, provideHTTPClient } from '../../src/runtime/core/http-client';

export function createModuleClient(handlers: FakeHandlerMap = {}) {
    const client = createFakeClient({ handlers });
    const moduleClient = new MTBAPIClient(client);

    return { client, moduleClient };
}

export function mountModuleComponent(
    component: Component,
    props: Record<string, any> = {},
    handlers: FakeHandlerMap = {},
) {
    let moduleClient : MTBAPIClient | undefined;

    const mounted = mountComponent(component, props, handlers, {
        onApp: (app, client) => {
            moduleClient = new MTBAPIClient(client);
            provideHTTPClient(moduleClient, app);
        },
    });

    return { ...mounted, moduleClient: moduleClient as MTBAPIClient };
}
