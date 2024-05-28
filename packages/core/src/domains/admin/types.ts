/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Coding } from '../coding';
import type { AdminConnectionPeerStatus } from './constants';

export type AdminConnectionPeer = {
    site: Coding<string>,
    status: `${AdminConnectionPeerStatus}`,
    details: string
};

export type AdminConnectionReport = {
    peers: AdminConnectionPeer[],
    createdAt: string
};
