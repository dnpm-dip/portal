import type {
    Coding,
    ExternalId,
    Patient,
    PatientMatchBase,
} from '@dnpm-dip/core';
import type { QueryCriteria } from '../query';

type Reference = {
    id: string,
    type: string,
    display?: string
};

type Period = {
    start: string,
    end?: string
};

export type PatientMatch = PatientMatchBase<QueryCriteria>;

export type NGSReportSNV = {
    id: string,
    patient: Record<string, any>,
    externalIds?: ExternalId[],
    chromosome: Coding,
    /**
     * todo: new prop
     */
    localization?: Coding[],
    gene: Coding,
    transcriptId: Coding,
    position: {
        start: number
    },
    altAllele: string,
    refAllele: string,
    dnaChange: Coding,
    proteinChange: Coding,
    readDepth: number,
    allelicFrequency: number,
    interpretation: Coding
};

export type NGSReportCNV = {
    id: string,
    patient: Reference,
    externalIds?: ExternalId[],
    chromosome: Coding,
    startRange?: {
        start: number,
        end: number
    },
    endRange?: {
        start: number,
        end: number
    },
    totalCopyNumber?: number,
    relativeCopyNumber: number,
    cnA?: number,
    cnB?: number,
    reportedAffectedGenes?: Coding[],
    reportedFocality?: string,
    type: Coding,
    copyNumberNeutralLoH?: Coding[]
};

export type NGSReportBRCAness = {
    [key: string]: any,
    value: number,
    confidenceRange: {
        min: number,
        max: number
    }
};

export type NGSHRDScore = {
    [key: string]: any,
    value: number,
    components: {
        lst: number,
        loh: number,
        tai: number,
    }
};

export type NGSDNAFusionPartner = {
    chromosome: string,
    gene: Coding,
    position: number
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-mtb-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/mtb/model/Variants.scala#L306
 */
export type NGSDNAFusion = {
    id: string,
    patient: Reference,
    /**
     * todo: new prop
     */
    externalIds?: ExternalId[],
    /**
     * todo: new prop
     */
    localization?: Coding[],
    fusionPartner5prime: NGSDNAFusionPartner,
    fusionPartner3prime: NGSDNAFusionPartner,
    reportedNumReads: number
};

export type NGSRNAFusionPartner = {
    chromosome: string,
    gene: Coding,
    position: number,
    strand: string
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-mtb-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/mtb/model/Variants.scala#L334
 */
export type NGSRNAFusion = {
    id: string,
    patient: Reference,
    /**
     * todo: new prop
     */
    externalIds?: ExternalId[],
    /**
     * todo: new prop
     */
    localization?: Coding[],
    fusionPartner5prime: NGSRNAFusionPartner,
    fusionPartner3prime: NGSRNAFusionPartner,
    effect?: string,
    reportedNumReads: number
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-mtb-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/mtb/model/NGSReport.scala
 */
export type NgsReportResults = {
    brcaness?: NGSReportBRCAness,
    copyNumberVariants: NGSReportCNV[],
    dnaFusions: NGSDNAFusion[],
    hrdScore?: NGSHRDScore,
    rnaFusions: NGSRNAFusion[],
    rnaSeqs: Record<string, any>[],
    simpleVariants: NGSReportSNV[],
    tmb?: {
        [key: string]: any,
        value: {
            value: number,
            unit: string,
        }
    },
    tumorCellContent?: {
        [key: string]: any,
        value: number
    }
};

export type SomaticNGSReport = {
    id: string,
    issuedOn: string,
    metadata: Record<string, any>[],
    patient: Reference,
    results: NgsReportResults,
    type: Coding<string>
};

type History<T = any> = {
    history: T[]
};

type Episode = {
    id: string,
    ttan?: string
    patient: Reference
    period: Period,
    status: Coding,
    diagnoses: Reference[]
};

type DiagnosisType = {
    value: Coding[],
    date: string
};

type TumorStaging = {
    date: string,
    method: Coding,
    tmnClassification?: {
        tumor: Coding,
        nodes: Coding,
        metastasis: Coding,
    },
    otherClassifications?: Coding[]
};

type TumorGrading = {
    date: string,
    codes: Coding[]
};

type Diagnosis = {
    id: string,
    patient: Reference,
    recordedOn: string,
    /**
     * todo: new type
     */
    type: History<DiagnosisType>,
    /**
     * todo: new type
     */
    germlineCodes?: Coding[],
    code: Coding,
    topography: Coding,
    staging?: History<TumorStaging>,
    grading?: History<TumorGrading>,
    guidelineTreatmentStatus?: Coding,
    /**
     * todo: new prop
     */
    histology?: Reference[],
    /**
     * todo: new prop
     */
    notes?: string[]
};

type SystemicTherapy = {
    id: string,
    patient: Reference,
    reason?: Reference,
    therapyLine?: number,
    basedOn?: Reference,
    recordedOn: string,
    status: Coding,
    statusReason?: Coding,
    /**
     * todo: new prop
     */
    recommendationFulfillmentStatus?: Coding,
    period?: Period,
    medication?: Coding[],
    notes?: string
    /**
     * todo: new prop
     */
    dosage?: Coding,
};

type OncoProcedure = {
    id: string,
    patient: Reference,
    reason?: Reference,
    therapyLine?: number,
    /**
     * todo: new prop
     */
    intent?: Coding,
    basedOn?: Reference,
    code: Coding,
    status: Coding,
    statusReason?: Coding,
    recordedOn:string,
    period?: Period,
    notes: string[]
};

type PerformanceStatus = {
    id: string,
    patient: Reference,
    effectiveDate: string,
    value: Coding
};

type TumorSpecimenCollection = {
    date?: string,
    method: Coding,
    localization: Coding
};

type TumorSpecimen = {
    id: string,
    patient: Reference,
    diagnosis: Reference,
    type: Coding,
    collection?: TumorSpecimenCollection
};

type HistologyReportResults = {
    tumorMorphology: {
        id: string,
        patient: Reference,
        specimen: Reference,
        value: Coding,
        notes?: string
    }
    tumorCellContent?: Record<string, any>
};

type HistologyReport = {
    id: string,
    issuedOn: string,
    patient: Reference,
    specimen: Reference,
    results: HistologyReportResults
};

type ProteinExpression = {
    id: string,
    patient: Reference,
    protein: Coding,
    value: Coding,
    tpsScore?: number,
    icScore?: Coding,
    tcScore?: Coding,
};

type IHCReport = {
    id: string,
    patient: Reference,
    specimen: Reference,
    issuedOn: string,
    journalId: string,
    blockIds: string[],
    results: {
        proteinExpression: ProteinExpression[],
        msiMmr: ProteinExpression[]
    },
};

type LevelOfEvidence = {
    grading?: Coding,
    addendums?: Coding[],
    publications?: {pmid: string, doi: string}[]
};

type Recommendation = {
    levelOfEvidence?: LevelOfEvidence,
};

type MedicationRecommendation = Recommendation & {
    id: string,
    patient: Reference,
    reason: Reference,
    priority: Coding,
    issuedOn: string,
    medication: Coding[],
    /**
     * todo: new type
     */
    category?: Coding,
    /**
     * todo: new prop
     */
    useType?: Coding,
    supportingVariants: { id: string, display: string, type: string }[]
};

type GeneticCounselingRecommendation = {
    id: string,
    patient: Reference,
    issuedOn: string,
    reason: Coding
};

type StudyEnrollmentRecommendation = {
    id: string,
    patient: Patient,
    reason: Reference,
    issuedOn: string,
    levelOfEvidence?: Coding,
    supportingVariants: { id: string, display: string, type: string }[],
    studyIds: string[]
};

type ProcedureRecommendation = Recommendation & {
    id: string,
    patient: Reference,
    reason?: Reference,
    issuedOn: string,
    priority: Coding,
    code: Coding,
    supportingVariants?: Reference[]
};

type HistologyReevaluationRequest = {
    id: string,
    patient: Reference,
    specimen: Reference,
    issuedOn: string,
};

type RebiopsyRequest = {
    id: string,
    patient: Reference,
    tumorEntity: Reference,
    issuedOn: string,
};

type CarePlan = {
    id: string,
    patient: Reference,
    reason: Reference,
    issuedOn: string,
    statusReason?: Coding,
    notes?: string[],
    medicationRecommendations?: MedicationRecommendation[],
    geneticCounselingRecommendation?: GeneticCounselingRecommendation,
    /**
     * todo: new prop
     */
    procedureRecommendations?: ProcedureRecommendation[],
    studyEnrollmentRecommendations?: StudyEnrollmentRecommendation[],

    /**
     * todo: new prop
     */
    histologyReevaluationRequests?: HistologyReevaluationRequest[],
    rebiopsyRequests?: RebiopsyRequest[]
};

type Claim = {
    id: string,
    patient: Reference,
    recommendation: Reference,
    /**
     * todo: new prop
     */
    requestedMedication?: Coding[],
    issuedOn: string,
    /**
     * todo: new prop
     */
    stage?: Coding,
    /**
     * @deprecated
     */
    status: Coding
};

type ClaimResponse = {
    id: string,
    patient: Reference,
    claim: Reference,
    issuedOn: string,
    status: Coding,
    statusReason?: Coding
};

type Response = {
    id: string,
    patient: Reference,
    therapy: Reference,
    effectiveDate: string,
    value: Coding
};

type FollowUp = {
    date: string,
    patient: Reference,
    lastContactDate?: string,
    patientStatus?: Coding
};

type MolecularDiagnosticReport = {
    id: string,
    patient: Reference,
    performer?: Reference,
    issuedOn: string,
    specimen: Reference,
    type: Coding,
    results?: string[]
};

export type PatientRecord = {
    patient: Patient,
    episodesOfCare: Episode[],
    diagnoses?: Diagnosis[],
    guidelineTherapies: SystemicTherapy[],
    guidelineProcedures: OncoProcedure[],
    performanceStatus: PerformanceStatus[],
    specimens?: TumorSpecimen[],
    histologyReports?: HistologyReport[],
    ihcReports?: IHCReport[],
    ngsReports?: SomaticNGSReport[],
    carePlans?: CarePlan[],
    claims?: Claim[],
    claimResponses?: ClaimResponse[],
    /**
     * todo: new prop
     */
    followUps?: FollowUp[],
    systemicTherapies?: History<SystemicTherapy>[],
    responses?: Response[],
    /**
     * todo: new prop
     */
    priorDiagnosticReports?: MolecularDiagnosticReport[]
};
