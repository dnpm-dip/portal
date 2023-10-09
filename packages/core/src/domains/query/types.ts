import type { Patient } from '../patient/types';
import type { QueryRequestMode } from './constants';

export type QueryRequestBodyCriteria = {
    code: string
};

// todo: criteria value could be record instead of array.
export type QueryRequestBody = Record<string, Record<string, QueryRequestBodyCriteria>[]>;

export type QuerySessionCreate = {
    mode?: `${QueryRequestMode}`,
    body: QueryRequestBody
};

export type QuerySession = {
    id: string,
    submittedAt: string,
    querier: string,
    mode: {
        code: string,
        display: string,
        system: string
    },
    criteria: QueryRequestBody,
    /**
     * Validity period (seconds) for the query.
     */
    expiresAfter: number,
    lastUpdate: string
};

export type QuerySummary = {
    id: string,
    numPatients: number
};

export type QueryPatientsResponse = {
    entries: Patient[]
};
