/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { QueryGeneAlterationCriteria } from './types';

export function buildQueryGeneAlterationCriteriaLabel(criteria: QueryGeneAlterationCriteria) {
    if (!criteria.gene) {
        return undefined;
    }

    const parts : string[] = [];

    parts.push(criteria.gene.display || criteria.gene.code);

    if (criteria.variant) {
        parts.push(criteria.variant.type);
    }

    return parts.join(' ');
}
