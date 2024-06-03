/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Coding } from '../coding';
import type { ConnectionPeerStatus } from './constants';

export type ConnectionPeer = {
    site: Coding<string>,
    status: `${ConnectionPeerStatus}`,
    details: string
};
