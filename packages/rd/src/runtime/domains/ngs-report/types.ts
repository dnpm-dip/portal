import type { Coding, Patient } from '@dnpm-dip/core';

type Reference = {
    id: string,
    type: string,
    display?: string
};

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
    position: number,
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

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDNGSReport.scala
 */
export type NGSReport = {
    id: string,
    patient: Patient,
    performingLab: {
        name: string
    },
    recordedOn?: string,
    type: Coding<'panel' | 'exome' | 'genome' | 'array'>,
    familyControls: Coding,
    sequencingInfo: {
        platform: Coding,
        kit: string
    },
    autozygosity?: Pick<Autozygosity, 'value'>,

    smallVariants?: SmallVariant[],
    copyNumberVariants?: CopyNumberVariant[],
    structuralVariants?: StructuralVariant[],
};
