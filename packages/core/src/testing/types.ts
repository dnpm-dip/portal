import type { HTTPClientOptions } from '../core/http-client';

export type FakeRequest = {
    method: string,
    url: string,
    body?: unknown,
    params: Record<string, string>,
    headers: Record<string, string>
};

export type FakeHandler = (request: FakeRequest) => unknown | Promise<unknown>;

export type FakeHandlerMap = Record<string, FakeHandler>;

export type FakeClientOptions = HTTPClientOptions & {
    handlers?: FakeHandlerMap,
    fallback?: FakeHandler
};
