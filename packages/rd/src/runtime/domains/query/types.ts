import type {
    CodeRecord,
    Coding,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase, QuerySummaryGrouped,
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

export type VariantDistribution = QuerySummaryGrouped<Coding, {
    diseaseCategoryDistribution: KeyValueRecords<Coding>,
    hpoTermDistribution: KeyValueRecords<Coding>
}>;

export type QuerySummaryDiagnostics = {
    overall: {
        hpoTermDistribution: KeyValueRecords<Coding>,
        diseaseCategoryDistribution: KeyValueRecords<Coding>
    },
    variant: VariantDistribution[]
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: QuerySummaryDiagnostics
};
