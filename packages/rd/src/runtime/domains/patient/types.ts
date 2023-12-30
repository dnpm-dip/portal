import type { Coding, Patient, PatientMatch } from '@dnpm-dip/core';
import type { RDCase } from '../case';
import type { RDDiagnosis } from '../diagnosis';
import type { RDNGSReport } from '../ngs-report';
import type { RDQueryCriteria } from '../query';
import type { RDTherapy } from '../therapy';

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
export type RDPatientRecord = {
    case: RDCase,
    diagnosis: RDDiagnosis,
    hpoTerms: HPOTerm[],
    ngsReports: RDNGSReport[],
    patient: Patient,
    therapy?: RDTherapy
};

export type RDPatientMatch = PatientMatch<RDQueryCriteria>;
