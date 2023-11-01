import type { Coding } from '../coding';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-core/blob/main/src/main/scala/de/dnpm/dip/model/Patient.scala
 */
export type Patient = {
    id: string,
    /**
     * @see https://github.com/KohlbacherLab/dnpm-dip-core/blob/main/src/main/scala/de/dnpm/dip/model/Gender.scala
     */
    gender: Coding<'male' | 'female' | 'other' | 'unknown'>
    birthDate: string,
    dateOfDeath?: string,
    managingSite?: Coding,
    healthInsurance?: unknown // todo: type is not defined ?!
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/main/src/main/scala/de/dnpm/dip/service/query/PatientMatch.scala
 */
export type PatientMatch<Criteria = any> = {
    id: string,
    managingSite?: Coding,
    gender: Coding<'male' | 'female' | 'other' | 'unknown'>,
    age: {
        value: number,
        /**
         * @see https://github.com/KohlbacherLab/dnpm-dip-core/blob/main/src/main/scala/de/dnpm/dip/model/Quantity.scala
         */
        unit: string
    },
    vitalStatus: Coding<'alive' | 'deceased'>,
    matchingCriteria: Criteria
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/main/src/main/scala/de/dnpm/dip/service/query/PatientFilter.scala
 */
export type PatientFilter = {
    genders: Coding<'male' | 'female' | 'other' | 'unknown'>[],
    ageRange: {
        min: number,
        max: number
    },
    vitalStatus: Coding<'alive' | 'deceased'>[]
};
