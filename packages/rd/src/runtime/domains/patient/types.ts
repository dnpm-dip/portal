import type { Coding, Patient, PatientMatchBase } from '@dnpm-dip/core';
import type { Case } from '../case';
import type { Diagnosis } from '../diagnosis';
import type { NGSReport } from '../ngs-report';
import type { QueryCriteria } from '../query';
import type { Therapy } from '../therapy';

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/Observations.scala
 */
type HPOTerm = {
    id: string,
    patient: Patient,
    value: Coding
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDPatientRecord.scala
 */
export type PatientRecord = {
    case: Case,
    diagnosis: Diagnosis,
    hpoTerms: HPOTerm[],
    ngsReports: NGSReport[],
    patient: Patient,
    therapy?: Therapy
};

export type PatientMatch = PatientMatchBase<QueryCriteria>;
