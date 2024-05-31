/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export enum AdminConnectionPeerStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
}

/**
 * @see https://github.com/KohlbacherLab/dnpm-dip-admin-service/blob/main/api/src/main/scala/de/dnpm/dip/admin/api/AdminPermissions.scala
 */
export enum AdminPermissionName {
    CONNECTION_REPORT_READ = 'connection_report_read',
}