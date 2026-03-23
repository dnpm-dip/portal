import type {
    CodeRecord,
    Coding,
    Distribution,
    KeyValueRecords,
    PatientFilter,
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
    sites?: Coding[],
    criteria: QueryCriteria
};

export type QueryDiagnosisFilter = {
    category?: Coding[],
};

export type QueryHpoFilter = {
    value?: Coding[]
};

export type QuerySession = QueryBase<QueryCriteria>;

export type QuerySummaryDiagnostics = {
    overallDistributions: {
        hpoTerms: Distribution<Coding>,
        diagnoses: Distribution<Coding>
    },
    distributionsByVariant: KeyValueRecords<Coding, {
        diagnoses: Distribution<Coding>,
        hpoTerms: Distribution<Coding>
    }>
};

export type QuerySummary = QuerySummaryBase & {
    diagnostics: QuerySummaryDiagnostics
};
