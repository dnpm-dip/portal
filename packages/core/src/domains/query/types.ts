import type { ObjectLiteral } from '../../types';
import type { Patient } from '../patient';
import type { QueryRequestMode } from './constants';

export type QueryBase<
    CRITERIA extends ObjectLiteral = ObjectLiteral,
    FILTERS extends ObjectLiteral = ObjectLiteral,
> = {
    id: string,
    submittedAt: string,
    querier: string,
    mode: {
        code: string,
        display: string,
        system: string
    },
    criteria: CRITERIA,
    filters: FILTERS
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
