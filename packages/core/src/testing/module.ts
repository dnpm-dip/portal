import { MemoryTransport } from 'hapic';
import type { MemoryResponseInit, TransportRequest } from 'hapic';
import { HTTPClient } from '../core/http-client';
import { matchRoute } from './matcher';
import type {
    FakeClientOptions,
    FakeHandler,
    FakeHandlerMap,
    FakeRequest,
} from './types';

const defaultFallback : FakeHandler = () => ({ entries: [], size: 0 });

export function fakeResponse(status: number, body?: any) : Response {
    return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

function normalizeBody(input: unknown) : unknown {
    if (input instanceof URLSearchParams) {
        return Object.fromEntries(input);
    }

    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch {
            return input;
        }
    }

    return input;
}

export class FakeClient extends HTTPClient {
    public readonly requests : FakeRequest[];

    constructor(options: FakeClientOptions = {}) {
        const {
            handlers,
            fallback,
            ...clientOptions
        } = options;

        const requests : FakeRequest[] = [];
        const map : FakeHandlerMap = handlers ?? {};
        const fb : FakeHandler = fallback ?? defaultFallback;

        const transport = new MemoryTransport({
            fetch: async (request: TransportRequest) : Promise<Response | MemoryResponseInit> => {
                const method = (request.method ?? 'GET').toUpperCase();
                const match = matchRoute(method, request.url, map);

                const headers : Record<string, string> = {};
                new Headers(request.headers).forEach((value, key) => {
                    headers[key.toLowerCase()] = value;
                });

                const entry : FakeRequest = {
                    method,
                    url: request.url,
                    body: normalizeBody(request.body),
                    params: match ? match.params : {},
                    headers,
                };
                requests.push(entry);

                const data = match ?
                    await match.handler(entry) :
                    await fb(entry);

                if (data instanceof Response) {
                    return data;
                }

                return { status: 200, body: data };
            },
        });

        super({
            ...clientOptions,
            baseURL: clientOptions.baseURL ?? 'http://fake.test',
            transport,
        });

        this.requests = requests;
    }
}

export function createFakeClient(options: FakeClientOptions = {}) : FakeClient {
    return new FakeClient(options);
}
