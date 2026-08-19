import type { FakeHandler, FakeHandlerMap } from './types';

export type RouteMatch = {
    handler: FakeHandler,
    params: Record<string, string>
};

function matchPath(pattern: string, path: string) : Record<string, string> | null {
    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
        return null;
    }

    const params : Record<string, string> = {};
    for (const [index, patternSegment] of patternSegments.entries()) {
        const pathSegment = pathSegments[index];
        if (typeof pathSegment === 'undefined') {
            return null;
        }

        if (patternSegment.startsWith(':')) {
            params[patternSegment.slice(1)] = pathSegment;
        } else if (patternSegment !== pathSegment) {
            return null;
        }
    }

    return params;
}

export function matchRoute(
    method: string,
    url: string,
    handlers: FakeHandlerMap,
) : RouteMatch | null {
    const path = new URL(url, 'http://localhost').pathname;

    let catchAll : RouteMatch | null = null;

    for (const [key, handler] of Object.entries(handlers)) {
        if (key === '*') {
            catchAll = { handler, params: {} };
            continue;
        }

        const separatorIndex = key.indexOf(' ');
        if (separatorIndex === -1) {
            continue;
        }

        if (key.slice(0, separatorIndex).toUpperCase() !== method) {
            continue;
        }

        const params = matchPath(key.slice(separatorIndex + 1), path);
        if (params) {
            return { handler, params };
        }
    }

    return catchAll;
}
