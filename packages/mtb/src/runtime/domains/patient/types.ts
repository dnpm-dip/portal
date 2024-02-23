import type { Coding, Patient, PatientMatchBase } from '@dnpm-dip/core';
import type { QueryCriteria } from '../query';

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
    sequencingType: string
};

export type PatientRecord = {
    patient: Patient,
    ngsReports?: NGSReport[],
    [key: string]: any
};
