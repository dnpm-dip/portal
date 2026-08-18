/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type AccountConsoleURLOptions = {
    /**
     * Bare path below the console root — no query string, no fragment.
     *
     * Defaults to `/`.
     */
    path?: string;

    /**
     * Realm forwarded as the console's `realmId` hint, so an expired IdP
     * session lands on that realm's sign-in rather than on the console's
     * realm chooser.
     *
     * Defaults to the realm the portal logs into
     * (`authupRealmId`, itself defaulting to the master realm).
     */
    realmId?: string | null;
};
