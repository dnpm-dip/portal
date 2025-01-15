/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { ObjectLiteral, PatientMatchBase, ResourceCollectionSlots } from '../../../core';
import { createResourceCollectionManager, injectHTTPClient } from '../../../core';
import { ValidationAPI } from '../../../domains';

export default defineComponent({
    props: {
        useCase: {
            type: String,
            required: true,
        },
    },
    slots: Object as SlotsType<ResourceCollectionSlots<PatientMatchBase>>,
    setup(props, setup) {
        const api = injectHTTPClient();
        const validationAPI = new ValidationAPI({ client: api, useCase: props.useCase });

        const manager = createResourceCollectionManager({
            load: async () => {
                const response = await validationAPI.getReportInfo();

                return {
                    data: response.entries,
                    total: response.size,
                };
            },
            slots: setup.slots,
            expose: setup.expose,
        });

        return () => manager.render();
    },
});
