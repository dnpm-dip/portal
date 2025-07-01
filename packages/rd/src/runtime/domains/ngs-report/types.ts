import type { Coding, Patient, Reference } from '@dnpm-dip/core';

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
    genes: Coding[],
    cDNAChange?: Coding,
    gDNAChange?: Coding,
    proteinChange?: Coding,
    acmgClass: Coding,
    acmgCriteria?: Coding[],
    zygosity: Coding,
    segregationAnalysis?: Coding,
    modeOfInheritance?: Coding,
    significance?: Coding,
    clinVarID?: string[],
    publications?: Reference[]
};

export type SmallVariant = Variant & {
    chromosome: Coding,
    startPosition: number,
    endPosition: number,
    ref: string,
    alt: string,
};

export type StructuralVariant = Variant & {
    iscnDescription?: Coding,
};

export type CopyNumberVariant = Variant & {
    chromosome: Coding,
    startPosition: number,
    endPosition: number,
    type?: Coding,
};

type SequencingInfo = {
    platform: Coding,
    kit: string
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDNGSReport.scala
 */
export type NGSReport = {
    id: string,
    patient: Patient,
    issuedOn: string,
    type: Coding,
    sequencingInfo: SequencingInfo,
    conclusion?: Coding,
    results?: {
        autozygosity?: Pick<Autozygosity, 'value'>,
        smallVariants?: SmallVariant[],
        copyNumberVariants?: CopyNumberVariant[],
        structuralVariants?: StructuralVariant[],
    }
};
