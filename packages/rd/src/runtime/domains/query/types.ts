import type {
    CodeRecord,
    Coding,
    ConceptsCount,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase,
} from '@dnpm-dip/core';

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

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    criteria: RDQueryCriteria
};

export type QuerySession = QueryBase<RDQueryCriteria>;

export type VariantDistribution = {
    key: Coding,
    value: {
        diseaseCategoryDistribution: ConceptsCount<Coding>,
        hpoTermDistribution: ConceptsCount<Coding>
    }
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: {
        overall: {
            hpoTermDistribution: ConceptsCount<Coding>,
            diseaseCategoryDistribution: ConceptsCount<Coding>
        },
        variant: VariantDistribution[]
    }
};
