/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '../../utils';
import type { ConceptCount } from '../types';

export function isConceptCount(input: unknown) : input is ConceptCount {
    return isObject(input) &&
        isObject(input.value) &&
        typeof input.value.count === 'number' &&
        typeof input.value.percent === 'number';
}
