import type {
    CodeRecord,
    Coding,
    Distribution,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
    QuerySummaryBase,
    QuerySummaryDemographics,
    ResourceCollectionLoadMeta,
    ResourceCollectionResponse,
} from '@dnpm-dip/http-kit';
import type { URLQueryRecord } from '@dnpm-dip/kit';
import type { PatientMatch, PatientRecord } from '../patient';

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

export interface IQueryAPI {
    submit(query: QuerySessionCreate) : Promise<QuerySession>;
    getOne(id: string) : Promise<QuerySession>;
    update(id: string, query?: Partial<QuerySessionCreate>) : Promise<QuerySession>;
    getDiagnosisFilter(id: string) : Promise<QueryDiagnosisFilter>;
    getHpoFilter(id: string) : Promise<QueryHpoFilter>;
    getPatients(id: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<PatientMatch>>;
    getDemographics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryDemographics>;
    getDiagnostics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryDiagnostics>;
    getPatientRecord(queryId: string, patientId: string) : Promise<PatientRecord>;
}
