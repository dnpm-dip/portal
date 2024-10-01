import type { ObjectLiteral } from '../../types';
import type { Coding } from '../coding';
import type { ConnectionPeer } from '../connection-peer';
import type { PatientFilter } from '../patient';
import type { Distribution, KeyValueRecords } from '../types';
import type { MinMaxRange } from '../utility';

export type DiagnosisFilter = {
    category?: Coding[],
};

export type HPOFilter = {
    value?: Coding[]
};

export type QueryFilters = {
    diagnoses: DiagnosisFilter,
    hpoTerms: HPOFilter,
    patient: PatientFilter,
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/main/src/main/scala/de/dnpm/dip/service/query/Query.scala
 */
export type QueryBase<
    CRITERIA extends ObjectLiteral = ObjectLiteral,
    FILTERS extends QueryFilters = QueryFilters,
> = {
    id: string,
    submittedAt: string,
    querier: string,
    mode: Coding,
    criteria?: CRITERIA | null,
    filters: FILTERS
    /**
     * Validity period (seconds) for the query.
     */
    expiresAfter: number,
    lastUpdate: string,
    peers: ConnectionPeer[]
};

export type QuerySummaryGroupedItem<K = Coding, V = KeyValueRecords<Coding>> = {
    key: K,
    value: V
};
export type QuerySummaryGrouped<K = Coding, V = KeyValueRecords> = QuerySummaryGroupedItem<K, V>[];

export type QuerySummaryDemographics = {
    siteDistribution: Distribution<Coding>,
    genderDistribution: Distribution<Coding>,
    ageDistribution: Distribution<MinMaxRange>,
};

export type QuerySummaryBase = {
    id: string,
    patientCount: number,
    demographics: QuerySummaryDemographics
};
