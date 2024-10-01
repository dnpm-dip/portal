import type {
    CodeRecord,
    Coding,
    Distribution,
    DistributionConceptsCount,
    DistributionNested,
    KMSurvivalReport,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase,
} from '@dnpm-dip/core';

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

export type QueryCriteria = {
    diagnoses?: Coding<string>[],
    tumorMorphologies?: Coding<string>[],
    medication?:QueryMedicationCriteria,
    responses?: Coding<string>[],
    variants?: QueryVariantCriteria
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    sites?: Coding[],
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;

export type QueryTherapyResponse = {
    medicationClasses: unknown[],
    medications: string[],
    supportingVariants: string[],
    responseDistribution: DistributionConceptsCount<Coding>
};
