import type {
    CodeRecord, Coding, MinMaxRange, QueryBase,
} from '@dnpm-dip/core';
import type { QueryRequestMode } from './constants';

export type RDVariantCriteria = 'gene' |
'cDNAChange' |
'gDNAChange' |
'proteinChange' |
'acmgClass' |
'acmgCriteria' |
'zygosity' |
'segregationAnalysis' |
'modeOfInheritance' |
'significance';

export type RDQueryCriteriaVariant<
    V = CodeRecord,
> = {
    [K in RDVariantCriteria]?: V
};

export type RDQueryCriteria = {
    diagnoses?: CodeRecord[],
    hpoTerms?: CodeRecord[],
    variants?: RDQueryCriteriaVariant[]
};

export type RDQuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    criteria: RDQueryCriteria
};

export type RDQuerySession = QueryBase<RDQueryCriteria>;

export type ConceptCount<CONCEPT = any> = {
    concept: CONCEPT,
    count: number
};

export type ConceptsCount<CONCEPT = any> = ConceptCount<CONCEPT>[];

export type VariantDistribution = {
    key: Coding,
    value: {
        diseaseCategory: ConceptsCount<Coding>,
        hpoTerm: ConceptsCount<Coding>
    }
};

export type RDQuerySummary = {
    id: string,
    numPatients: number,
    distributions: {
        site: ConceptsCount<Coding>,
        gender: ConceptsCount<Coding>,
        age: ConceptsCount<MinMaxRange>,
        hpoTerm: ConceptsCount<Coding>,
        diseaseCategory: ConceptsCount<Coding>
    },
    groupedDistributions: {
        variant: VariantDistribution[]
    }
};
