import type { Coding, Patient } from '@dnpm-dip/core';

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
    autozygosity?: number, // todo: type could only be extracted by payload
    variants?: unknown[] // todo: check type
};
