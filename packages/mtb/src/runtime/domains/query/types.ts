import type {
    CodeRecord,
    Coding,
    Distribution,
    DistributionConceptsCount,
    DistributionNested,
    KMSurvivalReport,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode, QuerySummaryBase,
} from '@dnpm-dip/core';
import type { FormMutationType } from '../form';

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

export type QuerySummary = QuerySummaryBase & {
    diagnostics: QuerySummaryTumorDiagnostics,
    medication: QuerySummaryMedication,
    survivalReport: KMSurvivalReport[]
};

export type QueryVariantCriteriaBase = {
    supporting?: boolean
};

export type QueryFusionCriteria<V = Coding> = QueryVariantCriteriaBase & {
    fusionPartner5pr?: V,
    fusionPartner3pr?: V
};

export type QuerySNVCriteria<V = Coding> = QueryVariantCriteriaBase & {
    dnaChange?: V,
    gene?: V,
    proteinChange?: V
};

export type QueryCNVCriteria<G = Coding, T = Coding> = QueryVariantCriteriaBase & {
    affectedGenes?: G[],
    type?: T
};

export type QueryMedicationCriteria<V = Coding> = {
    operator?: 'and' | 'or',
    drugs?: V[],
    usage?: V[]
};

export type QueryVariantCriteria = {
    operator?: 'and' | 'or',
    simpleVariants?: QuerySNVCriteria[],
    copyNumberVariants?: QueryCNVCriteria[],
    dnaFusions?: QueryFusionCriteria[],
    rnaFusions?: QueryFusionCriteria[],
};

export type QueryGeneAlterationSNVCriteria<T = Coding> = {
    type: `${FormMutationType.SNV}`,
    dnaChange?: T,
    proteinChange?: T,
};

export type QueryGeneAlterationCNVCriteria<T = Coding> = {
    type: `${FormMutationType.CNV}`,
    copyNumberType?: T[]
};

export type QueryGeneAlterationFusionCriteria<T = Coding> = {
    type: `${FormMutationType.FUSION}`,
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
    geneAlterations?: QueryGeneAlterationsCriteria,
    variants?: QueryVariantCriteria
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
