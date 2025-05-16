import type {
    Coding, Patient, Period, Reference,
} from '@dnpm-dip/core';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDTherapy.scala
 */
export type Therapy = {
    id: string,
    patient: Patient,
    basedOn?: Reference,
    /**
     * todo new prop
     */
    recordedOn: string,
    category?: Coding,
    type?: Coding,
    medication?: Coding[],
    /**
     * todo new prop
     */
    period?: Period,
    notes?: string[]
};
