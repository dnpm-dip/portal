/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum QueryEventBusEventName {
    SESSION_UPDATED = 'sessionUpdated',
    SESSION_EXPIRING = 'sessionExpiring',
    SESSION_EXPIRED = 'sessionExpired',

    SESSION_REFRESH_FAILED = 'sessionRefreshFailed',

    FILTERS_UPDATED = 'filtersUpdated',
}
