/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PermissionEvaluationContext } from '@authup/access';
import { injectStore } from '@authup/client-web-kit';
import type { Pinia } from 'pinia';
import { defineNuxtPlugin } from '#app';

type EvaluateFn = (ctx: PermissionEvaluationContext) => Promise<unknown>;

const methods = ['evaluate', 'evaluateOneOf', 'preEvaluate', 'preEvaluateOneOf'] as const;

/**
 * Since authup v1.0.0-beta.72 a bare permission name resolves the global
 * definition only. The dnpm-dip backend provisioned its permissions
 * (mtb_*, rd_*, connection_report_read, ...) in the realm it logs into,
 * while a provisioning against beta.72 creates them as global rows.
 * A check that names no owner therefore accepts either: the global
 * definition, else the one owned by the session realm.
 */
export default defineNuxtPlugin({
    name: 'dnpm:permission',
    dependsOn: ['authup'],
    setup(nuxt) {
        const store = injectStore(nuxt.$pinia as Pinia);
        const evaluator = store.permissionEvaluator;

        for (const method of methods) {
            const fn = evaluator[method].bind(evaluator) as EvaluateFn;

            evaluator[method] = (async (ctx: PermissionEvaluationContext) => {
                if (
                    typeof ctx.realmId !== 'undefined' ||
                    typeof ctx.clientId !== 'undefined' ||
                    !store.realmId
                ) {
                    return fn(ctx);
                }

                try {
                    return await fn(ctx);
                } catch (e) {
                    try {
                        return await fn({ ...ctx, realmId: store.realmId });
                    } catch {
                        throw e;
                    }
                }
            }) as never;
        }
    },
});
