import type {
    CodeRecord,
    Coding, Distribution,
    KeyValueRecords,
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

export type QuerySummaryDiagnostics = {
    overallDistributions: {
        hpoTerms: Distribution<Coding>,
        diseaseCategories: Distribution<Coding>
    },
    distributionsByVariant: KeyValueRecords<Coding, {
        diseaseCategories: Distribution<Coding>,
        hpoTerms: Distribution<Coding>
    }>
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: QuerySummaryDiagnostics
};
