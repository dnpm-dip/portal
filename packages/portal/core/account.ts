/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { REALM_MASTER_NAME } from '@authup/core-kit';
import { useRequestURL, useRuntimeConfig } from '#imports';
import type { AccountConsoleURLOptions } from './types';

/**
 * Build a link into the account console, the self-service surface served
 * by Authup's server-core on the IdP origin (Authup >= 1.0.0-beta.59).
 *
 * The portal origin rides along as `ref`, which the account console renders
 * as a back link after validating it against the trusted app origins. The
 * portal origin is already required to be trusted for the login callback,
 * so this costs no extra deployment configuration.
 *
 * The realm rides along as `realmId`. It only matters once the IdP session
 * is gone: the portal's own session outlives it (its token was minted
 * earlier and is held client-side), so the account icon still renders while
 * the console sees an unauthenticated visitor. The console consumes the hint
 * in exactly that state and starts the authorization-code flow against that
 * realm, instead of presenting a realm chooser. Unlike hub, the portal does
 * not read it off the session store: it pins the realm at login
 * (`authupRealmId`, see `pages/login/index.vue`), so the configured value is
 * the session realm and needs no store round-trip.
 *
 * `path` is a bare path: no query string, no fragment. The concatenation
 * below would otherwise emit a second `?`. It is deliberately NOT built
 * with `new URL(path, base)`, which would resolve against the origin and
 * so drop the sub-path when Authup is deployed behind a prefix-stripping
 * proxy (a publicUrl carrying a pathname).
 *
 * A builder is returned rather than a string so a caller can vary `path` or
 * override the realm without re-reading the runtime config; the config and
 * the request origin are read here, in `setup()`, where the Nuxt context is
 * guaranteed.
 *
 * The builder returns `undefined` when neither `accountUrl` nor `authupUrl`
 * is configured. Callers drop the entry rather than emit a root-relative
 * `/account` — `<VCNavItems>` only treats an ABSOLUTE url as a plain
 * anchor, so a relative one would silently become an in-app route that does
 * not exist.
 */
export function useAccountConsoleURL() : (options?: AccountConsoleURLOptions) => string | undefined {
    const runtimeConfig = useRuntimeConfig();

    const authupUrl = ((runtimeConfig.public.authupUrl as string | undefined) ?? '')
        .replace(/\/+$/, '');
    const baseUrl = ((runtimeConfig.public.accountUrl as string | undefined) || (authupUrl ? `${authupUrl}/account` : ''))
        .replace(/\/+$/, '');

    const realmIdDefault = (runtimeConfig.public.authupRealmId as string | undefined) || REALM_MASTER_NAME;

    const ref = encodeURIComponent(useRequestURL().origin);

    return (options = {}) => {
        if (!baseUrl) {
            return undefined;
        }

        const path = options.path ?? '/';
        const normalized = path.startsWith('/') ? path : `/${path}`;

        const realmId = typeof options.realmId === 'undefined' ?
            realmIdDefault :
            options.realmId;

        let query = `?ref=${ref}`;
        if (realmId) {
            query += `&realmId=${encodeURIComponent(realmId)}`;
        }

        return `${baseUrl}${normalized}${query}`;
    };
}
