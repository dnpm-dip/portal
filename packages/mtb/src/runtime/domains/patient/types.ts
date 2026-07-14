import type {
    Coding,
    ExternalId,
    GeneAlterationReference,
    History,
    Patient,
    PatientMatchBase,
    Period,
    Reference,
} from '@dnpm-dip/core';
import type { QueryCriteria } from '../query';

/**
 * Reference to an external system-qualified resource (e.g. study or publication).
 *
 * @see https://github.com/dnpm-dip/mtb-model — Study_Reference / Publication_Reference
 */
export type SystemReference = {
    id: string,
    system: string,
    display?: string,
    type?: string
};

export type PatientMatch = PatientMatchBase<QueryCriteria>;

export type NGSReportSNV = {
    id: string,
    patient: Reference,
    externalIds?: ExternalId[],
    chromosome: Coding,
    localization?: Coding[],
    gene: Coding,
    transcriptId: Coding,
    exonId?: string,
    position: {
        start: number,
        end?: number
    },
    altAllele: string,
    refAllele: string,
    dnaChange: string,
    proteinChange?: string,
    readDepth: number,
    allelicFrequency: number,
    interpretation?: Coding
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
    externalIds?: ExternalId[],
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
    externalIds?: ExternalId[],
    localization?: Coding[],
    fusionPartner5prime: NGSRNAFusionPartner,
    fusionPartner3prime: NGSRNAFusionPartner,
    effect?: string,
    reportedNumReads: number
};

export type TumorCellContent = {
    id: string,
    patient: Reference,
    specimen: Reference,
    method: Coding,
    value: number
};

/**
 * @see https://github.com/dnpm-dip/mtb-model — RNASeq
 */
export type NGSRNASeq = {
    id: string,
    patient: Reference,
    variant: Reference,
    rawCounts: number,
    transcriptsPerMillion: number,
    librarySize?: number,
    cohortRanking?: number,
    tissueCorrectedExpression?: boolean,
    gene?: Coding,
    transcriptId?: {
        value: string,
        system?: string
    },
    localization?: Coding[],
    externalIds?: ExternalId[]
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
    rnaSeqs: NGSRNASeq[],
    simpleVariants: NGSReportSNV[],
    tmb?: {
        [key: string]: any,
        interpretation?: Coding,
        value: {
            value: number,
            unit?: string,
        }
    },
    tumorCellContent?: TumorCellContent
};

export type NgsReportMetadata = {
    kitManufacturer: string,
    kitType: string,
    pipeline: string,
    referenceGenome: string,
    sequencer: string
};

export type SomaticNGSReport = {
    id: string,
    issuedOn: string,
    metadata: NgsReportMetadata[],
    patient: Reference,
    specimen: Reference,
    results: NgsReportResults,
    type: Coding<string>
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
    value: Coding,
    date: string
};

type TumorStaging = {
    date: string,
    method: Coding,
    tnmClassification?: {
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
    type: History<DiagnosisType>,
    germlineCodes?: Coding[],
    code: Coding,
    topography: Coding,
    staging?: History<TumorStaging>,
    grading?: History<TumorGrading>,
    guidelineTreatmentStatus?: Coding,
    histology?: Reference[],
    notes?: string[]
};

type FamilyMemberHistory = {
    id: string,
    patient: Reference,
    relationship: Coding
};

/**
 * Microsatellite-instability finding.
 *
 * @see https://github.com/dnpm-dip/mtb-model — MSI
 */
type MSI = {
    id: string,
    patient: Reference,
    specimen: Reference,
    method: Coding,
    interpretation: Coding,
    value: number
};

/**
 * @see https://github.com/dnpm-dip/mtb-model/blob/870b45145bf852c6d74ff755badcc0ff87a276e7/dto_model/src/main/scala/de/dnpm/dip/mtb/model/Therapies.scala
 */
type SystemicTherapy = {
    id: string,
    patient: Reference,
    reason?: Reference,
    therapyLine?: number,
    intent?: Coding,
    category?: Coding,
    basedOn?: Reference,
    recordedOn: string,
    status: Coding,
    statusReason?: Coding,
    recommendationFulfillmentStatus?: Coding,
    period?: Period,
    medication?: Coding[],
    notes?: string[],
    dosage?: Coding,
};

type OncoProcedure = {
    id: string,
    patient: Reference,
    reason?: Reference,
    therapyLine?: number,
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
        note?: string
    }
    tumorCellContent?: TumorCellContent
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
    cpsScore?: number,
    icScore?: Coding,
    tcScore?: Coding,
};

type IHCReport = {
    id: string,
    patient: Reference,
    specimen: Reference,
    issuedOn: string,
    results: {
        proteinExpression: ProteinExpression[],
        msiMmr: ProteinExpression[]
    },
};

type LevelOfEvidence = {
    grading: Coding,
    addendums?: Coding[],
    publications?: SystemReference[]
};

type Recommendation = {
    levelOfEvidence?: LevelOfEvidence,
    supportingVariants?: GeneAlterationReference[],
    supportingFindings?: Reference[],
};

type MedicationRecommendation = Recommendation & {
    id: string,
    patient: Reference,
    reason?: Reference,
    priority: Coding,
    issuedOn: string,
    medication: Coding[],
    category?: Coding[],
    useType?: Coding
};

type GeneticCounselingRecommendation = {
    id: string,
    patient: Reference,
    issuedOn: string,
    reason: Coding
};

type StudyEnrollmentRecommendation = Recommendation & {
    id: string,
    patient: Reference,
    reason?: Reference,
    issuedOn: string,
    priority: Coding,
    medication?: Coding[],
    study: SystemReference[]
};

type ProcedureRecommendation = Recommendation & {
    id: string,
    patient: Reference,
    reason?: Reference,
    issuedOn: string,
    priority: Coding,
    code: Coding
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
    reason?: Reference,
    issuedOn: string,
    boardType?: Coding,
    noSequencingPerformedReason?: Coding,
    recommendationsMissingReason?: Coding,
    notes?: string[],
    medicationRecommendations?: MedicationRecommendation[],
    geneticCounselingRecommendation?: GeneticCounselingRecommendation,
    procedureRecommendations?: ProcedureRecommendation[],
    studyEnrollmentRecommendations?: StudyEnrollmentRecommendation[],
    histologyReevaluationRequests?: HistologyReevaluationRequest[],
    rebiopsyRequests?: RebiopsyRequest[]
};

type Claim = {
    id: string,
    patient: Reference,
    recommendation: Reference,
    requestedMedication?: Coding[],
    issuedOn: string,
    stage?: Coding,
    /**
     * @deprecated no longer part of the ETL schema; kept for backwards compatibility.
     */
    status?: Coding
};

type ClaimResponse = {
    id: string,
    patient: Reference,
    claim: Reference,
    issuedOn: string,
    status?: Coding,
    statusReason?: Coding[]
};

type Response = {
    id: string,
    patient: Reference,
    therapy: Reference,
    effectiveDate: string,
    method?: Coding,
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

export type MVHSubmissionType = 'initial' | 'correction' | 'test' | 'addition' | 'followup';

export type ModelProjectConsentPurpose = 'case-identification' | 'reidentification' | 'sequencing';

export type ConsentProvisionType = 'permit' | 'deny';

export type ResearchConsentMissingReason =    | 'organizational-issues' |
    'technical-issues' |
    'patient-inability' |
    'other-patient-reason' |
    'consent-not-returned' |
    'patient-refusal';

type ConsentProvision = {
    date: string,
    purpose: ModelProjectConsentPurpose | string,
    type: ConsentProvisionType | string
};

type ModelProjectConsent = {
    version: string,
    date?: string,
    provisions: ConsentProvision[]
};

/**
 * MVH submission / consent metadata (Modellvorhaben Genomsequenzierung).
 *
 * @see https://github.com/dnpm-dip/mtb-model — MVH_Metadata
 */
type MVHMetadata = {
    type: MVHSubmissionType | string,
    transferTAN: string,
    modelProjectConsent: ModelProjectConsent,
    researchConsents?: Record<string, any>[],
    episodeOfCare?: Reference,
    reasonResearchConsentMissing?: ResearchConsentMissingReason | string
};

export type PatientRecord = {
    patient: Patient,
    metadata?: MVHMetadata,
    episodesOfCare: Episode[],
    diagnoses?: Diagnosis[],
    familyMemberHistories?: FamilyMemberHistory[],
    guidelineTherapies: SystemicTherapy[],
    guidelineProcedures: OncoProcedure[],
    performanceStatus: PerformanceStatus[],
    specimens?: TumorSpecimen[],
    histologyReports?: HistologyReport[],
    ihcReports?: IHCReport[],
    msiFindings?: MSI[],
    ngsReports?: SomaticNGSReport[],
    priorDiagnosticReports?: MolecularDiagnosticReport[],
    carePlans?: CarePlan[],
    claims?: Claim[],
    claimResponses?: ClaimResponse[],
    followUps?: FollowUp[],
    systemicTherapies?: History<SystemicTherapy>[],
    responses?: Response[]
};
