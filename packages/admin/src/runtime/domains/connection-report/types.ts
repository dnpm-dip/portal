/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ConnectionPeer } from '@dnpm-dip/core';

export type ConnectionReport = {
    peers: ConnectionPeer[],
    self: ConnectionPeer,
    createdAt: string
};
