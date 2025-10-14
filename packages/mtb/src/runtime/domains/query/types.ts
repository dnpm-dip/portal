import type {
    CodeRecord,
    Coding,
    Distribution,
    DistributionConceptsCount,
    DistributionNested,
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
    distributionsByVariant: KeyValueRecords<string, {
        tumorEntities: Distribution<Coding>,
        tumorMorphologies: Distribution<Coding>
    }>,
};

type MedicationRecommendations = {
    overallDistribution: DistributionNested<Coding>,
    distributionBySupportingVariant: KeyValueRecords<string, Distribution<string[]>>
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
    dnaChange?: T,
    proteinChange?: T,
};

export type QueryGeneAlterationCNVCriteria<T = Coding> = {
    type: `${QueryMutationType.CNV}`,
    copyNumberType?: T[]
};

export type QueryGeneAlterationFusionCriteria<T = Coding> = {
    type: `${QueryMutationType.FUSION}`,
    partner?: T
};

export type QueryGeneAlterationVariantCriteria<T = Coding> = QueryGeneAlterationCNVCriteria |
QueryGeneAlterationSNVCriteria |
QueryGeneAlterationFusionCriteria<T>;

export type QueryGeneAlterationCriteria<T = Coding> = {
    gene: T,
    supporting?: boolean,
    negated?: boolean,
    variant?: QueryGeneAlterationVariantCriteria<T>
};

export type QueryGeneAlterationsCriteria = {
    operator?: 'and' | 'or',
    items?: QueryGeneAlterationCriteria[]
};

export type QueryCriteria = {
    diagnoses?: Coding<string>[],
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

export type QueryTherapyResponse = {
    medicationClasses: Coding[],
    medications: Coding[],
    supportingVariants: string[],
    responseDistribution: DistributionConceptsCount<Coding>
};

export type QueryTherapyResponseByVariant = {
    medicationClasses: Coding[],
    medications: Coding[],
    supportingVariant: string,
    responseDistribution: DistributionConceptsCount<Coding>
};

export type QueryTherapyResponseInfo = {
    entity: Coding,
    medications: string[],
    supportingAlteration: string,
    count: number,
    orr: number,
    responseDistribution: DistributionConceptsCount<Coding>,
    meanDuration: number
};

export type QueryGeneAlterationInfo = {
    entity: Coding,
    gene: Coding,
    alteration: string,
    count: number,
    supporting: boolean
};
