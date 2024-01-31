import type {
    CodeRecord,
    Coding,
    Distribution,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase,
} from '@dnpm-dip/core';

export type QuerySummaryTumorDiagnostics = {
    overallDistributions: {
        tumorEntities: Distribution<Coding>,
        tumorMorphologies: Distribution<Coding>
    },
    distributionsByVariant: KeyValueRecords<string, {
        tumorEntities: Distribution<Coding>,
        tumorMorphologies: Distribution<Coding>
    }>,
};

type MedicationRecommendations = {
    overallDistribution: Distribution<Coding>,
    distributionBySupportingVariant: KeyValueRecords<string, Distribution<string[]>>
};

type MedicationTherapies = {
    meanDurations: Distribution<string[]>,
    overallDistribution: Distribution<string[]>,
    responseDistributionByTherapy: KeyValueRecords<string[], Distribution<Coding>>
};

export type QuerySummaryMedication = {
    recommendations: MedicationRecommendations,
    therapies: MedicationTherapies
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: QuerySummaryTumorDiagnostics,
    medication: QuerySummaryMedication
};

export type QueryFusionCriteria<V = Coding> = {
    fusionPartner5pr?: V,
    fusionPartner3pr?: V
};

export type QuerySNVCriteria<V = Coding> = {
    dnaChange?: V,
    gene?: V,
    proteinChange?: V
};

export type QueryCNVCriteria<G = Coding, T = Coding> = {
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
