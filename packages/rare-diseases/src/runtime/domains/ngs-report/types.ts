import type { Coding, Patient } from '@dnpm-dip/core';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/Observations.scala
 */
export type Autozygosity = {
    id: string,
    patient: Patient,
    value: number
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/Observations.scala#L69
 */
export type Variant = {
    id: string,
    patient: Patient,
    gene: Coding,
    levelOfEvidence?: string,
    iscnDescription?: string,
    pubMedID?: {
        value: string,
        system?: string
    },
    cDNAChange?: Coding,
    gDNAChange?: Coding,
    proteinChange?: Coding,
    acmgClass: Coding,
    acmgCriteria?: Coding[], // todo: is appropriate type for set
    zygosity: Coding,
    segregationAnalysis?: Coding,
    modeOfInheritance?: Coding,
    significance?: Coding,
    clinVarAccessionID?: string[]
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDNGSReport.scala
 */
export type RDNGSReport = {
    id: string,
    patient: Patient,
    performingLab: {
        name: string
    },
    recordedOn?: string,
    type: Coding<'panel' | 'exome' | 'genome' | 'array'>,
    familyControls: Coding,
    metaInfo: {
        sequencingType: string,
        kit: string
    },
    autozygosity?: Pick<Autozygosity, 'value'>,
    variants?: Variant[]
};
