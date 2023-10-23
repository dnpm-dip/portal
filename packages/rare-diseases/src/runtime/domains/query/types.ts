import type { Patient, QueryBase } from '@dnpm-dip/core';
import type { QueryRequestMode } from './constants';

export type QueryRequestBodyCriteria = {
    code: string
};

export type QueryRequestBody = Record<string, Record<string, QueryRequestBodyCriteria>[]>;

export type QuerySessionCreate = {
    mode?: `${QueryRequestMode}`,
    body: QueryRequestBody
};

export type QuerySession = QueryBase<QueryRequestBody>;

export type QuerySummary = {
    id: string,
    numPatients: number
};

export type QueryPatientsResponse = {
    entries: Patient[]
};
