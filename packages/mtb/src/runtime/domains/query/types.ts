import type {
    CodeRecord,
    Coding, ConceptsCount, QueryBase, QueryRequestMode, QuerySummaryBase, QuerySummaryGrouped,
} from '@dnpm-dip/core';

export type QuerySummaryTumorDiagnostics = {
    tumorEntityDistribution: ConceptsCount<Coding>,
    tumorEntityDistributionByVariant: QuerySummaryGrouped,
    tumorMorphologyDistribution: ConceptsCount<Coding>
};

type MedicationRecommendations = {
    overallDistribution: ConceptsCount<Coding>,
    distributionbySupportingVariant: QuerySummaryGrouped
};

type MedicationTherapies = {
    overallDistribution: ConceptsCount<Coding>,
    responseDistributionByTherapy: QuerySummaryGrouped
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
