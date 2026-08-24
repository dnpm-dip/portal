import { injectHTTPClient as injectBaseHTTPClient } from '@dnpm-dip/vue';
import type { IHTTPClient } from '@dnpm-dip/http-kit';
import { createApp, defineComponent, h } from 'vue';
import {
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest';
import type { IAdminAPIClient } from '../../../src/runtime/core/http-client';
import {
    injectHTTPClient,
    isHTTPClientUsable,
    provideHTTPClient,
} from '../../../src/runtime/core/http-client';
import { createModuleClient, mountModuleComponent } from '../../utils';

let injected : { admin?: IAdminAPIClient, base?: IHTTPClient } = {};

const Probe = defineComponent({
    setup() {
        injected = {
            admin: injectHTTPClient(),
            base: injectBaseHTTPClient(),
        };

        return () => h('div');
    },
});

describe('admin http-client di', () => {
    beforeEach(() => {
        injected = {};
    });

    it('should throw when no client has been provided', () => {
        expect(() => injectHTTPClient()).toThrow('The APIClient is not set.');
    });

    it('should report usability per app instance', () => {
        const app = createApp(Probe);
        const otherApp = createApp(Probe);

        expect(isHTTPClientUsable(app)).toBe(false);

        provideHTTPClient(createModuleClient().moduleClient, app);

        expect(isHTTPClientUsable(app)).toBe(true);
        expect(isHTTPClientUsable(otherApp)).toBe(false);
    });

    it('should keep the first provided client when a second one is provided', () => {
        const app = createApp(Probe);
        const first = createModuleClient().moduleClient;
        const second = createModuleClient().moduleClient;

        provideHTTPClient(first, app);
        provideHTTPClient(second, app);

        expect(first).not.toBe(second);
        expect(app.runWithContext(() => injectHTTPClient())).toBe(first);
    });

    it('should keep the admin client separate from the base client', () => {
        const { client, moduleClient } = mountModuleComponent(Probe);

        expect(injected.admin).toBe(moduleClient);
        expect(injected.base).toBe(client);
        expect(injected.base).not.toBe(injected.admin);
    });
});
