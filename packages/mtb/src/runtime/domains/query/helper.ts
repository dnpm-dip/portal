/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Coding } from '@dnpm-dip/core';
import type { QueryGeneAlteration, QueryGeneAlterationCriteria } from './types';

function codingToString(coding: Coding): string {
    return coding.display || coding.code;
}

export function queryGeneAlterationToString(entity: QueryGeneAlteration): string {
    switch (entity.type) {
        case 'SNV':
            return `${codingToString(entity.gene)} ${entity.proteinChange || 'SNV'}`;
        case 'CNV':
            return `${codingToString(entity.gene)} ${codingToString(entity.copyNumberType)}`;
        case 'Fusion':
            return `${codingToString(entity.gene)}-${codingToString(entity.partner)} Fusion`;
        default:
            return '???';
    }
}

export function buildQueryGeneAlterationCriteriaLabel(criteria: QueryGeneAlterationCriteria) {
    if (!criteria.gene) {
        return undefined;
    }

    const parts : string[] = [];

    parts.push(codingToString(criteria.gene));

    if (criteria.alteration) {
        parts.push(criteria.alteration.type);
    }

    return parts.join(' ');
}
