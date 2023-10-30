import type { ObjectLiteral } from '../../types';
import type { Coding } from '../coding';
import type { PatientFilter } from '../patient';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/main/src/main/scala/de/dnpm/dip/service/query/Query.scala
 */
export type QueryBase<
    CRITERIA extends ObjectLiteral = ObjectLiteral,
    FILTERS extends PatientFilter = PatientFilter,
> = {
    id: string,
    submittedAt: string,
    querier: string,
    mode: Coding,
    criteria: CRITERIA,
    filters: FILTERS
    /**
     * Validity period (seconds) for the query.
     */
    expiresAfter: number,
    lastUpdate: string
};
