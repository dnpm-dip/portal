/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { APIClient } from '@authup/core';

export function useAuthupAPIClient() : APIClient {
    const nuxt = useNuxtApp();
    return nuxt.$authupApi as APIClient;
}
