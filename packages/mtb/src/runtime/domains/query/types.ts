import type {
    type CodeRecord,
    type Coding,
    type ConceptsCount,
    type Distribution,
    DistributionConceptsCount,
    type DistributionNested,
    type KMSurvivalReport,
    type KeyValueRecords,
    type QueryBase,
    type QueryRequestMode,
    type QuerySummaryBase,
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
    overallDistribution: DistributionNested<string[]>,
    responseDistributionByTherapy: KeyValueRecords<string[], Distribution<Coding>>
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

export type QueryCriteria = {
    diagnoses?: Coding<string>[],
    tumorMorphologies?: Coding<string>[],
    simpleVariants?: QuerySNVCriteria[],
    copyNumberVariants?: QueryCNVCriteria[],
    dnaFusions?: QueryFusionCriteria[],
    rnaFusions?: QueryFusionCriteria[],
    medication?:QueryMedicationCriteria,
    responses?: Coding<string>[]
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;

export type QueryTherapyResponse = {
    medicationClasses: unknown[],
    medications: string[],
    supportingVariants: string[],
    responseDistribution: DistributionConceptsCount<Coding>
};
