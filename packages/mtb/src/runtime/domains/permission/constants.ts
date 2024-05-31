/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/a0ff56ddc44cd582392d84f37864d7965695520c/src/main/scala/de/dnpm/dip/service/validation/ValidationPermissions.scala#L21
 * @see https://github.com/KohlbacherLab/dnpm-dip-service-base/blob/a0ff56ddc44cd582392d84f37864d7965695520c/src/main/scala/de/dnpm/dip/service/query/QueryPermissions.scala#L19
 */
export enum PermissionName {
    VALIDATION_INFO_READ = 'mtb_validation_infos_read',
    VALIDATION_REPORT_READ = 'mtb_validation_report_read',
    VALIDATION_PATIENT_RECORD_READ = 'mtb_validation_patient_record_read',

    QUERY_SUBMIT = 'mtb_query_submit',
    RESULT_SUMMARY_READ = 'mtb_result_summary_read',
    PATIENT_MATCHES_READ = 'mtb_patient_matches_read',
    PATIENT_RECORD_READ = 'mtb_patient_record_read',
}
