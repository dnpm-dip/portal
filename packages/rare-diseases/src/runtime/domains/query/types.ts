import type { Patient, QueryBase } from '@dnpm-dip/core';
import type { QueryRequestMode } from './constants';

export type QueryCriteriaScopeValue = {
    code: string
};

export type QueryCriteriaScopes = {
    diagnosis?: Record<string, QueryCriteriaScopeValue>[],
    hpoTerms?: QueryCriteriaScopeValue[],
    variants?: Record<string, QueryCriteriaScopeValue>[]
};

export type QuerySessionCreate = {
    mode?: `${QueryRequestMode}`,
    criteria: QueryCriteriaScopes
};

export type QuerySession = QueryBase<QueryCriteriaScopes>;

export type QuerySummary = {
    id: string,
    numPatients: number
};

export type QueryPatientsResponse = {
    entries: Patient[]
};
