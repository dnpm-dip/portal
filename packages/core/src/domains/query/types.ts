import type { ObjectLiteral } from '../../types';
import type { Coding } from '../coding';
import type { PatientFilter } from '../patient';
import type { MinMaxRange } from '../utility';

export type ConceptCount<CONCEPT = any> = {
    concept: CONCEPT,
    count: number
};

export type ConceptsCount<CONCEPT = any> = ConceptCount<CONCEPT>[];

export type DiagnosisFilter = {
    category?: Coding[],
};

export type HPOFilter = {
    value?: Coding[]
};

export type QueryFilters = {
    diagnosisFilter: DiagnosisFilter,
    hpoFilter: HPOFilter,
    patientFilter: PatientFilter,
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
    criteria: CRITERIA,
    filters: FILTERS
    /**
     * Validity period (seconds) for the query.
     */
    expiresAfter: number,
    lastUpdate: string
};

export type QuerySummaryGroupedItem<K = Coding, V = ConceptsCount<Coding>> = {
    key: K,
    value: V
};
export type QuerySummaryGrouped<K = Coding, V = ConceptsCount> = QuerySummaryGroupedItem<K, V>[];

export type QuerySummaryDemographics = {
    siteDistribution: ConceptsCount<Coding>,
    genderDistribution: ConceptsCount<Coding>,
    ageDistribution: ConceptsCount<MinMaxRange>,
};

export type QuerySummaryBase = {
    id: string,
    patientCount: number,
    demographics: QuerySummaryDemographics
};
