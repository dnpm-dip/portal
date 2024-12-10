/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '../utils';
import type { DistributionQuantities } from './types';

export function isDistributionQuantities(input: unknown) : input is DistributionQuantities {
    return isObject(input) &&
        typeof input.total === 'number' &&
        Array.isArray(input.elements);
}
