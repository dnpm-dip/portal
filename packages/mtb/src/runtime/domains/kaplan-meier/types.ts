/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Coding, KeyValueRecord } from '@dnpm-dip/core';

export type KaplanMeierOptions = KeyValueRecord<Coding<string>, Coding<string>[]>;
