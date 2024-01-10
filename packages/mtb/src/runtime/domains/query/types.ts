import type {
    CodeRecord, Coding, ConceptsCount, QueryBase, QueryRequestMode, QuerySummaryBase,
} from '@dnpm-dip/core';

export type TumorDiagnostics = {
    tumorEntityDistribution: ConceptsCount<Coding>,
    tumorMorphologyDistribution: ConceptsCount<Coding>
};

type MedicationRecommendations = {
    overallDistribution: ConceptsCount<Coding>,
    distributionbySupportingVariant: {
        key: Coding,
        value: ConceptsCount<Coding>
    }[]
};

type MedicationTherapies = {
    overallDistribution: ConceptsCount<Coding>,
    responseDistributionByTherapy: {
        key: Coding,
        value: ConceptsCount<Coding>
    }[]
};

export type Medication = {
    recommendations: MedicationRecommendations,
    therapies: MedicationTherapies
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: TumorDiagnostics,
    medication: Medication
};

export type QueryFusionCriteria<V = Coding> = {
    fusionPartner5pr?: V,
    fusionPartner3pr?: V
};

export type QuerySNVCriteria<V = Coding> = {
    gene?: V,
    dnaChange?: V,
    proteinChange?: V
};

export type QueryCNVCriteria<V = Coding> = {
    affectedGenes?: V[],
    type?: V
};

export type QueryMedicationCriteria<V = Coding> = {
    operator?: 'and' | 'or',
    drugs: V[],
    usage: V
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
