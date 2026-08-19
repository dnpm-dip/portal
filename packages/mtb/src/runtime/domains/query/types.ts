import type {
    CodeRecord,
    Coding,
    Distribution,
    DistributionConceptsCount,
    DistributionNested,
    KeyValueRecord,
    KeyValueRecords,
    QueryBase,
    QueryRequestMode,
    QuerySummaryDemographics,
    ResourceCollectionLoadMeta,
    ResourceCollectionResponse,
} from '@dnpm-dip/http-kit';
import type { URLQueryRecord } from '@dnpm-dip/kit';
import type { KMSurvivalReport } from '@dnpm-dip/vue';
import type { PatientMatch, PatientRecord } from '../patient';

import type { QueryMutationType } from './constants';

export type QuerySummaryTumorDiagnostics = {
    overallDistributions: {
        tumorEntities: DistributionNested<Coding>,
        tumorMorphologies: DistributionNested<Coding>
    },
};

export type QuerySummaryGeneAlterationDistribution = KeyValueRecord<string, DistributionNested<string>>;

type MedicationRecommendations = {
    overallDistribution: DistributionNested<Coding>,
    distributionBySupportingVariant: KeyValueRecords<QueryGeneAlteration, Distribution<string[]>>
};

type MedicationTherapies = {
    meanDurations: KeyValueRecords<Coding[], KeyValueRecords<Coding[], number>>,
    overallDistribution: DistributionNested<string[]>
};

export type QuerySummaryMedication = {
    recommendations: MedicationRecommendations,
    therapies: MedicationTherapies
};

export type QueryMedicationCriteria<V = Coding> = {
    operator?: 'and' | 'or',
    items?: V[],
    usage?: V[]
};

export type QueryGeneAlterationSNVCriteria = {
    type: `${QueryMutationType.SNV}`,
    dnaChange?: string,
    proteinChange?: string,
};

export type QueryGeneAlterationCNVCriteria<T = Coding> = {
    type: `${QueryMutationType.CNV}`,
    copyNumberType?: T[]
};

export type QueryGeneAlterationFusionCriteria<T = Coding> = {
    type: `${QueryMutationType.FUSION}`,
    partner?: T,
};

export type QueryGeneAlterationVariantCriteria<T = Coding> = QueryGeneAlterationCNVCriteria |
QueryGeneAlterationSNVCriteria |
QueryGeneAlterationFusionCriteria<T>;

export type QueryGeneAlterationCriteria<T = Coding> = {
    gene: T,
    supporting?: boolean,
    wildtype?: boolean,
    alteration?: QueryGeneAlterationVariantCriteria<T>
};

export type QueryGeneAlterationsCriteria = {
    operator?: 'and' | 'or',
    items?: QueryGeneAlterationCriteria[]
};

export type QueryCriteria = {
    tumorEntities?: Coding<string>[],
    tumorMorphologies?: Coding<string>[],
    medication?:QueryMedicationCriteria,
    responses?: Coding<string>[],
    geneAlterations?: QueryGeneAlterationsCriteria
};

export type QueryDiagnosisFilter = {
    code?: Coding<string>[]
};
export type QueryTherapyRecommendedFilter = {
    medication?: Coding<string>[][]
};
export type QueryTherapyImplementedFilter = {
    medication?: Coding<string>[][]
};

export type QuerySessionCreate = {
    mode?: CodeRecord<`${QueryRequestMode}` | QueryRequestMode>,
    sites?: Coding[],
    criteria: QueryCriteria
};

export type QuerySession = QueryBase<QueryCriteria>;

//

export type QueryGeneAlterationSNV<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.SNV}`,
    proteinChange?: string,
};

export type QueryGeneAlterationCNV<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.CNV}`,
    copyNumberType: T | string
};

export type QueryGeneAlterationFusion<T = Coding> = {
    gene: T,
    type: `${QueryMutationType.FUSION}`,
    partner: T,
};

export type QueryGeneAlteration = QueryGeneAlterationSNV | QueryGeneAlterationCNV | QueryGeneAlterationFusion;

export type QueryTherapyResponse = {
    tumorEntity: Coding,
    medications: Coding[],
    supportingAlteration: QueryGeneAlteration,
    levelsOfEvidence?: Coding[],
    count: number,
    orr?: number,
    dcr?: number,
    responseDistribution: DistributionConceptsCount<Coding | string>,
    meanDuration?: number
};

export type QueryCoarseTherapyResponse = {
    tumorEntity: Coding,
    medications: Coding[],
    supportingAlterations?: QueryGeneAlteration[],
    levelsOfEvidence?: Coding[],
    count: number,
    countResponderPFSRatio: number,
    orr?: number,
    dcr?: number,
    responseDistribution: DistributionConceptsCount<Coding | string>,
    meanDuration?: number
};

export type QueryGeneAlterationInfo = {
    tumorEntity: Coding,
    alteration: QueryGeneAlteration,
    gene: Coding,
    count: number,
    supporting: boolean
};

export interface IQueryAPI {
    submit(query: QuerySessionCreate) : Promise<QuerySession>;
    getOne(id: string) : Promise<QuerySession>;
    update(id: string, query?: QuerySessionCreate) : Promise<QuerySession>;
    getDiagnosisFilter(id: string) : Promise<QueryDiagnosisFilter>;
    getTherapyImplementedFilter(id: string) : Promise<QueryTherapyImplementedFilter>;
    getTherapyRecommendedFilter(id: string) : Promise<QueryTherapyRecommendedFilter>;
    getPatients(id: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<PatientMatch>>;
    getPatientRecord(queryId: string, patientId: string) : Promise<PatientRecord>;
    getKaplanMeierStatistics(queryId: string, type?: string, grouping?: string) : Promise<KMSurvivalReport>;
    getTherapyResponses(queryId: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<QueryTherapyResponse>>;
    getCoarseTherapyResponses(queryId: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<QueryCoarseTherapyResponse>>;
    getGeneAlterationInfos(queryId: string, meta?: ResourceCollectionLoadMeta) : Promise<ResourceCollectionResponse<QueryGeneAlterationInfo>>;
    getGeneAlterationDistributions(
        queryId: string,
        meta?: ResourceCollectionLoadMeta,
    ) : Promise<ResourceCollectionResponse<QuerySummaryGeneAlterationDistribution>>;
    getTumorDiagnostics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryTumorDiagnostics>;
    getMedication(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryMedication>;
    getDemographics(queryId: string, query?: URLQueryRecord) : Promise<QuerySummaryDemographics>;
}
