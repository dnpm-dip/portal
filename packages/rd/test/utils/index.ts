import { createFakeClient } from '@dnpm-dip/http-kit/testing';
import type { FakeHandlerMap } from '@dnpm-dip/http-kit/testing';
import { mountComponent } from '@dnpm-dip/vue/testing';
import type { Component } from 'vue';
import { RDHTTPClient, provideHTTPClient } from '../../src/runtime/core';

export function createModuleClient(handlers: FakeHandlerMap = {}) {
    const client = createFakeClient({ handlers });
    const moduleClient = new RDHTTPClient(client);

    return { client, moduleClient };
}

export function mountModuleComponent(
    component: Component,
    props: Record<string, any> = {},
    handlers: FakeHandlerMap = {},
) {
    let moduleClient : RDHTTPClient | undefined;

    const mounted = mountComponent(component, props, handlers, {
        onApp: (app, client) => {
            moduleClient = new RDHTTPClient(client);
            provideHTTPClient(moduleClient, app);
        },
    });

    return { ...mounted, moduleClient: moduleClient as RDHTTPClient };
}
