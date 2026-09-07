import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import {
    injectHTTPClient,
    isHTTPClientUsable,
    provideHTTPClient,
} from '../../../src/runtime/core/http-client';
import { createModuleClient } from '../../utils';

const Probe = defineComponent({
    setup() {
        return () => h('div');
    },
});

describe('mtb http-client di', () => {
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
});

describe('MTBAPIClient', () => {
    it('should scope the prepared-query api to the mtb use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/prepared-queries': () => ({ entries: [], size: 0 }) });

        await moduleClient.preparedQuery.getMany();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/prepared-queries');
    });

    it('should scope the validation api to the mtb use case', async () => {
        const { client, moduleClient } = createModuleClient({ 'GET /mtb/validation/infos': () => ({ entries: [], size: 0 }) });

        await moduleClient.validation.getReportInfo();

        expect(client.requests[0]?.method).toBe('GET');
        expect(client.requests[0]?.url).toContain('/mtb/validation/infos');
    });
});
