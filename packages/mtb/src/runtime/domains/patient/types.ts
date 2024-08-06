import type { Coding, Patient, PatientMatchBase } from '@dnpm-dip/core';
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
    externalIds: Coding[],
    chromosome: Coding,
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
    patient: Record<string, any>,
    chromosome: Coding,
    startRange: {
        start: number,
        end: number
    },
    endRange: {
        start: number,
        end: number
    },
    totalCopyNumber: number,
    relativeCopyNumber: number,
    cnA: number,
    cnB: number,
    reportedAffectedGenes: Coding[],
    reportedFocality: string,
    type: Coding,
    copyNumberNeutralLoH: Coding[]
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
    patient: { type: string, id: string },
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
    patient: { type: string, id: string },
    fusionPartner5prime: NGSRNAFusionPartner,
    fusionPartner3prime: NGSRNAFusionPartner,
    effect?: string,
    externalIds: Record<string, any>[],
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

export type NGSReport = {
    id: string,
    issuedOn: string,
    metadata: Record<string, any>[],
    patient: { id: string, type: string },
    results: NgsReportResults,
    sequencingType: Coding<string>
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

type Diagnosis = {
    id: string,
    patient: Reference,
    recordedOn?: string,
    code: Coding,
    topography?: Coding,
    whoGrading?: Coding,
    stageHistory: Record<string, any>[], // todo fix type
    guidelineTreatmentStatus?: Coding,
};

type MedicationTherapy = {
    id: string,
    patient: Reference,
    indication: Reference,
    therapyLine?: number,
    basedOn?: Reference,
    recordedOn: string,
    status?: Coding,
    statusReason?: Coding,
    period?: Period,
    medication?: Coding[],
    notes?: string
};

type OncoProcedure = {
    id: string,
    patient: Reference,
    indication: Reference,
    code: Coding,
    status: Coding,
    statusReason?: Coding,
    therapyLine?: number,
    basedOn?: Reference,
    recordedOn?:string,
    period: Period,
    note?: string
};

type PerformanceStatus = {
    id: string,
    patient: Reference,
    effectiveDate: string,
    value: Coding
};

// todo: fix type
type TumorSpecimenCollection = {
    date: string,
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

type HistologyReport = {
    id: string,
    patient: Reference,
    specimen: Reference,
    value: Coding,
    notes?: string
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
    date: string,
    journalId: any, // todo: fix type
    blockId: any, // todo: fix type
    proteinExpressionResults: ProteinExpression[],
    msiMmrResults: ProteinExpression[]
};

type LevelOfEvidence = {
    grading?: Coding,
    addendums?: Coding[],
    publications?: {pmid: string, doi: string}[]
};

type MedicationRecommendation = {
    id: string,
    patient: Reference,
    indication: Reference,
    levelOfEvidence?: LevelOfEvidence,
    priority: Coding,
    issuedOn: string,
    medication: Coding[],
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

type CarePlan = {
    id: string,
    patient: Reference,
    indication: Reference,
    issuedOn: string,
    statusReason?: Coding,
    notes?: string,
    medicationRecommendations?: MedicationRecommendation[],
    geneticCounselingRecommendation?: GeneticCounselingRecommendation,
    studyEnrollmentRecommendations?: StudyEnrollmentRecommendation[]
};

type Claim = {
    id: string,
    patient: Reference,
    recommendation: Reference,
    issuedOn: string,
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

export type PatientRecord = {
    patient: Patient,
    episodesOfCare: Episode[],
    diagnoses?: Diagnosis[],
    guidelineTherapies: MedicationTherapy[],
    guidelineProcedures: OncoProcedure[],
    performanceStatus: PerformanceStatus[],
    specimens?: TumorSpecimen,
    histologyReports?: HistologyReport[],
    ihcReports?: IHCReport[],
    ngsReports?: NGSReport[],
    carePlans?: CarePlan[],
    claims?: Claim[],
    claimResponses?: ClaimResponse[],
    therapies?: History<MedicationTherapy>[],
    responses?: Response[]
};
