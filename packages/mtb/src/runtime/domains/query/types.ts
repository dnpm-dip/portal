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

// todo: set type
export type QueryCriteria = {
    foo: string
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;
