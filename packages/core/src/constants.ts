/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum ModuleType {
    DEFAULT = 'default',
    USE_CASE = 'useCase',
}

export enum LogicalOperator {
    AND = 'and',
    OR = 'or',
}

export enum InjectionKey {
    QUERY_UPDATED_AT = 'queryUpdatedAt',
    QUERY_FILTERS = 'queryFilters',
}
