import type {
    CodeRecord,
    Coding,
    Distribution,
    DistributionConceptsCount,
    DistributionNested, KeyValueRecord,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
} from '@dnpm-dip/core';

import type { QueryMutationType } from './constants';

export type QuerySummaryTumorDiagnostics = {
    overallDistributions: {
        tumorEntities: DistributionNested<Coding>,
        tumorMorphologies: DistributionNested<Coding>
    },
    distributionsByVariant: KeyValueRecords<QueryGeneAlteration, {
        tumorEntities: Distribution<Coding>,
        tumorMorphologies: Distribution<Coding>
    }>,
};

export type QuerySummaryGeneAlterationDistribution = KeyValueRecord<string, DistributionNested<string>>;

type MedicationRecommendations = {
    overallDistribution: DistributionNested<Coding>,
    distributionBySupportingVariant: KeyValueRecords<QueryGeneAlteration, Distribution<string[]>>
};

type MedicationTherapies = {
    meanDurations: Distribution<string[]>,
    overallDistribution: DistributionNested<string[]>
};

export type QuerySummaryMedication = {
    recommendations: MedicationRecommendations,
    therapies: MedicationTherapies
};

export type QueryMedicationCriteria<V = Coding> = {
    operator?: 'and' | 'or',
    items?: V[],
    usage?: V[]
};

export type QueryGeneAlterationSNVCriteria<T = Coding> = {
    type: `${QueryMutationType.SNV}`,
    dnaChange?: string,
    proteinChange?: string,
};

export type QueryGeneAlterationCNVCriteria<T = Coding> = {
    type: `${QueryMutationType.CNV}`,
    copyNumberType?: T[]
};

export type QueryGeneAlterationFusionCriteria<T = Coding> = {
    type: `${QueryMutationType.FUSION}`,
    partner?: T,
};

export type QueryGeneAlterationVariantCriteria<T = Coding> = QueryGeneAlterationCNVCriteria |
QueryGeneAlterationSNVCriteria |
QueryGeneAlterationFusionCriteria<T>;

export type QueryGeneAlterationCriteria<T = Coding> = {
    gene: T,
    supporting?: boolean,
    wildtype?: boolean,
    alteration?: QueryGeneAlterationVariantCriteria<T>
};

export type QueryGeneAlterationsCriteria = {
    operator?: 'and' | 'or',
    items?: QueryGeneAlterationCriteria[]
};

export type QueryCriteria = {
    tumorEntities?: Coding<string>[],
    tumorMorphologies?: Coding<string>[],
    medication?:QueryMedicationCriteria,
    responses?: Coding<string>[],
    geneAlterations?: QueryGeneAlterationsCriteria
};

export type QueryDiagnosisFilter = {
    code?: Coding<string>[]
};
export type QueryTherapyRecommendedFilter = {
    medication?: Coding<string>[][]
};
export type QueryTherapyImplementedFilter = {
    medication?: Coding<string>[][]
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    sites?: Coding[],
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;

//

export type QueryGeneAlterationSNV<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.SNV}`,
    dnaChange: string,
    proteinChange: string,
};

export type QueryGeneAlterationCNV<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.CNV}`,
    copyNumberType: T
};

export type QueryGeneAlterationFusion<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.FUSION}`,
    partner: T,
};

export type QueryGeneAlteration = QueryGeneAlterationSNV | QueryGeneAlterationCNV | QueryGeneAlterationFusion;

export type QueryTherapyResponse = {
    tumorEntity: Coding,
    medications: string[],
    supportingAlteration: QueryGeneAlteration,
    count: number,
    orr: number,
    responseDistribution: DistributionConceptsCount<Coding>,
    meanDuration: number
};

export type QueryGeneAlterationInfo = {
    tumorEntity: Coding,
    alteration: QueryGeneAlteration,
    gene: Coding,
    count: number,
    supporting: boolean
};
