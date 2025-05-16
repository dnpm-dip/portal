import type {
    Coding,
    ExternalReference,
    GeneAlterationReference,
    History,
    Patient,
    PatientMatchBase,
    Reference,
} from '@dnpm-dip/core';
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
    recordedOn?: string,
    onsetDate?: string
    value: Coding,
    status?: History<Coding>
};

type GMFCSStatus = {
    id: string,
    patient: Reference,
    effectiveDate: string,
    value: Coding
};

type Hospitalization = {
    numberOfStays: Coding,
    numberOfDays: Coding
};

type TherapyRecommendation = {
    id: string,
    patient: Reference,
    issuedOn: string,
    category: Coding,
    type: Coding,
    medication?: Coding[],
    supportingVariants?: GeneAlterationReference[]
};

type StudyEnrollmentRecommendation = {
    id: string,
    patient: Reference,
    issuedOn: string,
    supportingVariants?: GeneAlterationReference[],
    study: ExternalReference[],
};

type ClinicalManagementRecommendation = {
    [key: string]: any,
};

type CarePlan = {
    id: string,
    patient: Patient,
    issuedOn: string,
    noSequencingPerformedReason?: Coding,
    geneticCounselingRecommended?: boolean,
    reevaluationRecommended?: boolean,
    therapyRecommendations?: TherapyRecommendation[],
    studyEnrollmentRecommendations?: StudyEnrollmentRecommendation[],
    clinicalManagementRecommendation?: ClinicalManagementRecommendation,
    notes?: string[]
};

/**
 * todo check type
 */
type FollowUp = {
    [key: string]: any
};

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-rd-model/blob/main/dto_model/src/main/scala/de/dnpm/dip/rd/model/RDPatientRecord.scala
 */
export type PatientRecord = {
    patient: Patient,
    /**
     * todo new prop
     */
    episodesOfCare: Case[],
    diagnoses: Diagnosis[],

    /**
     * todo: new prop
     */
    gmfcsStatus: GMFCSStatus[],
    /**
     * todo new prop
     */
    hospitalization: Hospitalization,
    hpoTerms: HPOTerm[],
    ngsReports: NGSReport[],
    carePlans?: CarePlan[],
    followUps?: FollowUp[],
    therapies?: History<Therapy>[]
};

export type PatientMatch = PatientMatchBase<QueryCriteria>;
