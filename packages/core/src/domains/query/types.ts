import type { ObjectLiteral } from '../../types';
import type { Coding } from '../coding';
import type { ConnectionPeer } from '../connection-peer';
import type { Distribution } from '../types';
import type { MinMaxRange } from '../utility';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/main/src/main/scala/de/dnpm/dip/service/query/Query.scala
 */
export type QueryBase<
    CRITERIA extends ObjectLiteral = ObjectLiteral,
    FILTERS extends ObjectLiteral = ObjectLiteral,
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
