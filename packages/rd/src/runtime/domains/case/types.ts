import type { Patient } from '@dnpm-dip/core';
import type { RDDiagnosis } from '../diagnosis';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDCase.scala
 */
export type RDCase = {
    id: string,
    externalId?: {
        value: string,
        system?: string
    },
    gestaltMatcherId?: {
        value: string,
        system?: string
    },
    face2geneId?: {
        value: string,
        system?: string
    },
    patient: Patient,
    recordedOn?: string,
    referrer: {
        name: string
    },
    reason: RDDiagnosis
};
