import type { PatientMatch, QueryBase } from '@dnpm-dip/core';
import type { QueryRequestMode } from './constants';

export type RDQueryCriteriaScopeValue = {
    code: string
};

export type RDQueryCriteriaScopes = {
    diagnoses?: Record<string, RDQueryCriteriaScopeValue>[],
    hpoTerms?: RDQueryCriteriaScopeValue[],
    variants?: Record<string, RDQueryCriteriaScopeValue>[]
};

export type RDQuerySessionCreate = {
    mode?: `${QueryRequestMode}`,
    criteria: RDQueryCriteriaScopes
};

export type RDQuerySession = QueryBase<RDQueryCriteriaScopes>;

export type RDQuerySummary = {
    id: string,
    numPatients: number
};
