import type {
    CodeRecord,
    Coding,
    ConceptsCount,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase,
} from '@dnpm-dip/core';

export type VariantCriteria = 'gene' |
'cDNAChange' |
'gDNAChange' |
'proteinChange' |
'acmgClass' |
'acmgCriteria' |
'zygosity' |
'segregationAnalysis' |
'modeOfInheritance' |
'significance';

export type QueryCriteriaVariant<
    V = CodeRecord,
> = {
    [K in VariantCriteria]?: V
};

export type QueryCriteria = {
    diagnoses?: CodeRecord[],
    hpoTerms?: CodeRecord[],
    variants?: QueryCriteriaVariant[]
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;

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
